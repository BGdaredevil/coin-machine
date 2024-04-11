import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.write("sending all posts");
    res.end();
});

router.get("/:id", (req, res) => {
    res.write("Sending 1 post");
    res.end();
});

router.post("/", (req, res) => {
    res.write("Accepting 1 post");
    console.log(req.body);
    res.end();
});

router.put("/:id", (req, res) => {
    res.write("i shall replace the post with this one");
    console.log(req.body);
    res.end();
});

router.patch("/:id", (req, res) => {
    console.log(req.body);
    res.write("i shall merge the post with this one");
    res.end();
});

router.delete("/:id", (req, res) => {
    console.log(req.body);
    res.write("i shall delete this post");
    res.end();
});

export default router;
