const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/hangthedj");
const jwt = require('jwt-simple')
const { socketServer } = require('./socketHelper');


const User = conn.define('user', {
  id: {
    primaryKey:true,
    type: Sequelize.UUID,
    unique: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
    validate: {
      notEmpty: true
    }
  },
  authKey: {
      type: Sequelize.STRING
  },
  refKey: {
    type: Sequelize.STRING
}
});
const Track = conn.define('track', {
    id:{primaryKey:true,
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        validate: {
        notEmpty: true
        }
    },
    action:{
        type:Sequelize.STRING
    },
    track:{
        primaryKey:true,
        type:Sequelize.STRING,
        unique:false,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    },
    album:{
        type:Sequelize.STRING
    }
  },{
    hooks: {
      afterCreate: function(message){
        if(socketServer()){
          socketServer().emit(message.action, message);
          //const sockets = Object.values(socketServer().clients().connected);
        }
      }
    }
});

const sync = async () => {
    await conn.sync({ force: true })
};

const addUser=async(input)=>{
    const user = await User.create(input)
    const token = jwt.encode({id:user.id},"NONE")
    return token
}

const getUser=async(token)=>{
    const userId = jwt.decode(token,"NONE").id
    const user = await User.findByPk(userId)
    return user
}
const addTrack=async(track)=>{
    return await Track.create(track)
}

module.exports={
    sync,
    addUser,
    getUser,
    addTrack,
    models:{
        User
    }
}