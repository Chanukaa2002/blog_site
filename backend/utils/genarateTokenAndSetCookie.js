import jwt from "jsonwebtoken";

export const genarateTokenAndSetCookie = (res, id) => {
  try {
    const token = jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, //cookie cannot be accessed by client side
        sameSite: "strict", //cookie cannot be accessed by cross site
        secure: process.env.NODE_ENV !== "development",
      });
  } catch (error) {
    console.log(`Error in genarateTokenAndSetCookie => ${error}`);
  }
};
