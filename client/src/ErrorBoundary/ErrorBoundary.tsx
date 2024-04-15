import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Component, PropsWithChildren } from "react";

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren<any>, State> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch() {
        this.setState({ hasError: true });
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Box width={"100%"} height={"100%"} boxSizing={"border-box"} padding={"10px"}>
                    <Card sx={{ boxSizing: "border-box" }}>
                        <CardMedia
                            component="img"
                            src={
                                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.ccZ3NuduOZTeee7Y_ZywgwHaE8%26pid%3DApi&f=1&ipt=400831efc6ca6bbeeb44a6a87a31b32893f1b20484d4c66e0401b312d1e30bbe&ipo=images"
                            }
                            alt="Product-image"
                            sx={{ objectFit: "cover" }}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                This is not the page you are looking for
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                sx={{ marginLeft: "auto" }}
                                variant="outlined"
                                size="small"
                                onClick={() => (window.location.href = "/")}
                            >
                                Try Again ?
                            </Button>
                        </CardActions>
                    </Card>
                </Box>
            );
        }
        return children;
    }
}

export default ErrorBoundary;
