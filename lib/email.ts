import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rvyu.app@gmail.com",
    pass: "cgtkiqxshpajaqnd",
  },
});

export default transporter;
