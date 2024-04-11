import { Box, TextField } from "@mui/material";
import { FC } from "react";

const Register: FC = () => {
    return (
        <div>
            <Box component="form" noValidate autoComplete="off" maxWidth={"500px"} margin={"0 auto"}>
                <TextField color="secondary" id="email-input" label="Email" placeholder="Email" variant="standard" fullWidth />
                <TextField color="secondary" id="password-input" label="Password" placeholder="Password" variant="standard" fullWidth />
                <TextField
                    color="secondary"
                    id="repeat-password-input"
                    label="Repeat Password"
                    placeholder="Repeat Password"
                    variant="standard"
                    fullWidth
                />
            </Box>
        </div>
    );
};

export default Register;
