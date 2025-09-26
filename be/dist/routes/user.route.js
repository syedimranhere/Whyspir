import router from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { upload } from "../utils/multer.js";
const userRouter = router();
userRouter.post('/register', upload.fields([
    { name: "avatar", maxCount: 1 },
]), registerUser);
userRouter.post('/login', loginUser);
export default userRouter;
//# sourceMappingURL=user.route.js.map