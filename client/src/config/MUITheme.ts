import { ThemeOptions, darkScrollbar } from "@mui/material";
import { grey } from "@mui/material/colors";

const themeConfig: ThemeOptions = {
    palette: {
        mode: "dark",
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // html: {
                    // ...darkScrollbar(
                        
                    //          {
                    //               track: grey[200],
                    //               thumb: grey[400],
                    //               active: grey[400],
                    //           }
                    // ),
                    //scrollbarWidth for Firefox
                    // scrollbarWidth: "thin",
                // },
            },
        },
    },
    // components: {

    //     MuiCssBaseline: {
    //         styleOverrides: {
    //             div: {
    //                 ...darkScrollbar({
    //                     track: grey[200],
    //                     thumb: grey[400],
    //                     active: grey[400],
    //                 }),
    //                 scrollbarWidth: "thin",
    //             },
    //         },
    //     },
    // },
};

export default themeConfig;
