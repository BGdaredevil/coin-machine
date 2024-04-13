import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/Auth";
import { IApiProduct } from "../../../utils/commonTypes";
import { listPersonalProducts } from "../../../services/productService";
import { isCancelledErrorProcessor } from "../../../services/apiService";
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import EditProduct from "../edit/EditProduct";

interface PersonalProductsCatalogProps {}

const PersonalProductsCatalog: FC<PersonalProductsCatalogProps> = () => {
    const { user } = useContext(AuthContext);

    const [products, setProducts] = useState<IApiProduct[]>([]);
    const [selectedProduct, setSelectedproduct] = useState<IApiProduct | null>(null);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        const controller = new AbortController();

        listPersonalProducts({ signal: controller.signal })
            .then((res) => {
                setProducts(res);
            })
            .catch(isCancelledErrorProcessor);

        return () => controller.abort();
    }, [user]);

    return (
        <Box>
            <EditProduct
                dialogTitle={"edit"}
                open={!!selectedProduct}
                product={selectedProduct}
                onCancel={() => setSelectedproduct(null)}
                onClose={() => setSelectedproduct(null)}
                onSubmit={(data) => {
                    setSelectedproduct(null);
                    setProducts((prev) =>
                        prev.map((p) => {
                            if (p._id === data._id) {
                                return { ...data };
                            }

                            return p;
                        })
                    );
                }}
            />
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                {products.map((product) => (
                    <div key={product._id}>
                        <Card sx={{ width: "280px", margin: "10px", boxSizing: "border-box" }}>
                            <CardMedia
                                component="img"
                                src={product.imageUrl}
                                alt="Product-image"
                                sx={{ objectFit: "cover", height: "200px" }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="div">
                                    {product.inventoryCount} available at {product.price} EUR/pcs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    sx={{ marginLeft: "auto" }}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setSelectedproduct(product)}
                                >
                                    Edit
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>
        </Box>
    );
};

export default PersonalProductsCatalog;
