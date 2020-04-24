import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '"Quicksand"'
        ].join(','),
    },
    palette: {
        type: 'dark',
        primary:{
            main:'#00c853',
        }
      }
});

export default theme;