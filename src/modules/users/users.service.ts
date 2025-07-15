import { UtilSlug } from "./../../utils/UtilSlug";
import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "../../schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LoginUserDto } from "./dto/login-user.dto";

import { JwtService } from "@nestjs/jwt";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { SellerApplicationDto } from "./dto/seller-application.dto";
import { UpdateShopInfoDto } from "./dto/update-shop-info.dto";
import { Product, ProductDocument } from "../../schemas/product.schema";
import { TokenVerifier } from "../../utils/TokenVerifier";
const admin = require("firebase-admin");

// const serviceAccount = require('../../utils/ecommerce-3dcd5-firebase-adminsdk-8iryd-a787e6184a.json');
const firebaseParam = {
  type: "service_account",
  project_id: "ecommerce-3dcd5",
  private_key_id: "a787e6184a0cab923957c36b1952599ef3560c5a",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCs9novakIL969t\nVllTCsFhrP7BigImJ5tPF8yXk67zroQupvyPGz9GfwqOpPaS0plugouj83MqXu5n\n23re1VFQ+jJOCdQr4oYaSH0gQzz7GjUAhzHX9oU1LCg20fqPrHAZ0NwNEJVtzNv1\nvcZeKgko5+/h53sSG+3GGSozTjiQMMlzg3qNQ3oHMuEVHNyxBTrUHob+TZkkdE2u\n1eiNjJeTNfhAGYDs282kcv6b8Gu26IMef/7MCM+yTGwe0AMKPBlMTs8WFvhccmPX\nrdjJO0XjRNivS53FdvGDLyR4Pmz2yL3CFuBFta8Qh+GAgPgaCBPScLIY06XdFHmF\ngcUV3ETPAgMBAAECggEABXJ9xqCCE/5o9/iQN51PGdRo8Y93Idx9d7A4MU3lZKdK\nYm2/5oHlLEM0AeoQGe+oBWL3IuK37c2vlHXFGN9/AB3hF7QXiopHzuwZhLqZYQ8i\nPDIFz9djupj5a0CRs5SqsyVwyLiM/DhHdSXU6YJJZ5BmbabsqVVX17VTLup3vZK+\neib15dZLtGS5Vr7qnigSRbi5WhR6oNUFZRqZUBGm16NAGpsprXXqq/sv3sjF35o7\nWo7/j+rgAqJrZHZTo9vzPmy7cFkjYFqBQ2JfdvEVUtftv0eNOEJM+tQ4UY0TXmpc\ne6knbI4e7kKQ+W7YbgaPm1bHv+DnFuOHIURq9r/YgQKBgQDjZJ19c2XkAMH5o6Y/\nuNA+ebT3eb2zawQg4EpyclHtYjqviIfHnaEZEUgdBXzXN+NIxRz0avqKQ3UMXKhA\njHUZFqaTZ1b1FeU15TEkfpKRghlS+k9JlDodPN0IpJDSdAA/51XLzCWLfIboMjCm\nIIsF9ArvIUWBvNmekwhSQlRZgwKBgQDCuOP/e5P37JbkCT7gzjLytFXUoJ00cgox\ngSZyzHlPvKEFgpMtUz+mcrBbY8Rd4D9nZf6PeY9Fvet2uAUEs2jZN6UGdp3QfGVJ\n/fFvqdjLtNwRtlAcpmHiha0BUAhHuKVnRzPMUyt9VFBy2zw+hIdFMvBLEkPZu7Av\nr43CzjihxQKBgEHAKCHMKlwhM/WBMmMeh2hpPMCKPSYR/aGb+Sraj4H6c0mqSsiX\ndauP6bAqlAyPJnM2O8cY39T26HNon2X6tylH+WaJ7QT1Dc/ls63/w1W7rqLlqeN2\nrs8heDA1lYKk9CWGOLKzFvAcU830JUkEA+72v+qhTj3TY4GMtk1CzK0NAoGBAIhg\nje7FUmD1psiXYR55zF0HyIVe6DtvE4yQc6k7ZEtgRTZiuUmpYI7nDHU1braA9Gcq\nnBtIe/vQhDVltL4SGYDo4/+e2/DE7vvfi1U1k804IlmVYo5uSWgpT33325S/0bh/\nuduE9JSWlLGcspjmoQbqIjmx1SuNtFvxjEu/uxIxAoGBAL4zZukDIGVYFqJKggC0\n71skJhLQHMtqcJkM7GpO+Sm2H2poVRUxehRS2RIhZJ5TozfrkEIYHvoCxM/IRrtS\nuna3Ym/jIEsU58dXVEPFLz+ipCjGYGK945wFrTmENlnhzTEj/2oj17H0VSDdkffK\n/CwTASigJuUuRTRh3ENUXpaW\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-8iryd@ecommerce-3dcd5.iam.gserviceaccount.com",
  client_id: "104103893159513889984",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8iryd%40ecommerce-3dcd5.iam.gserviceaccount.com",
};
admin.initializeApp({
  credential: admin.credential.cert(firebaseParam),
});

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    // @InjectModel(Portfolio.name) private portfolioModel: Model<PortfolioDocument>,
    // @InjectModel(Picture.name) private pictureModel: Model<PictureDocument>,
    private jwtService: JwtService // eslint-disable-next-line no-empty-function
  ) {
    this.userModel.findByIdAndUpdate(
      {
        _id: {
          $oid: "640759ad632d86a8e096eb24",
        },
      },
      {
        _id: {
          $oid: "640759ad632d86a8e096eb24",
        },
        email: "toukir.ahammed36@gmail.com",
        __v: 0,
        avatar: "https://tinyurl.com/382e6w5t",
        createdAt: {
          $date: {
            $numberLong: "1678203309094",
          },
        },
        fullName: "Kozuki Oden",
        slug: "kozuki_oden_srbuo9JWB",
        tokenType: "email",
        updatedAt: {
          $date: {
            $numberLong: "1679378363220",
          },
        },
        role: "admin",
        status: "active",
      },
      {
        upsert: true,
      }
    );
  }

  async register(registerUserDto: RegisterUserDto) {
    const result = await this.userModel.create({
      slug: UtilSlug.getUniqueId(registerUserDto.fullName),
      fullName: registerUserDto.fullName,
      email: registerUserDto.email,
      // password: registerUserDto.password,
      role: registerUserDto.role,
      tokenType: registerUserDto.tokenType,
      status: "active",
    });
    return result;
  }

  async seller_apply(sellerApplicationDto: SellerApplicationDto) {
    console.log("from service", sellerApplicationDto.email);
    const checkEmail = await this.userModel.find({
      email: sellerApplicationDto.email,
    });
    console.log("checkEmail-", checkEmail);
    if (!checkEmail.length) {
      return await this.userModel.create({
        slug: UtilSlug.getUniqueId(sellerApplicationDto.shop.shop_name),
        email: sellerApplicationDto.email,
        user_email: sellerApplicationDto.user_email,
        fullName: sellerApplicationDto.fullName,
        avatar: sellerApplicationDto.avatar,
        phone: sellerApplicationDto.phone,
        shop: sellerApplicationDto.shop,
        status: sellerApplicationDto.status,
        role: sellerApplicationDto.role,
      });
    } else {
      console.log("already exists from ");
      return "already exists from  backend !";
    }
  }

  async login(loginUserDto: Partial<LoginUserDto>): Promise<
    Partial<User> &
    Partial<{
      slug: string;
      role: string;
      access_token: string | null;
      userId?: string;
    }>
  > {
    // console.log("loginUserDto", loginUserDto);
    const { token, tokenType } = loginUserDto;
    let isVerified = false;
    const accessToken = null;

    if (tokenType == "facebook") {
      isVerified = await TokenVerifier.verifyFacebookToken(token);
    } else if (tokenType == "google") {
      isVerified = await TokenVerifier.verifyGoogleToken(token);
      console.log("is verify google", isVerified);
    } else if (tokenType == "email") {
      try {
        const decodedUser = await admin.auth().verifyIdToken(token); // 73-9 token verify hole bhitorer data gulo return korbe
        if (decodedUser?.uid) {
          isVerified = true;
        }
      } catch { }
    }

    if (isVerified) {
      const { email, fullName, role } = loginUserDto;

      let user = await this.userModel.findOne({ email: email });

      if (!user) {
        user = await this.userModel.findOneAndUpdate(
          { email: email },
          {
            $set: {
              ...loginUserDto,
              slug: UtilSlug.getUniqueId(),
            },
          },
          { upsert: true, new: true }
        );
      }

      if (user?.role === "admin" || user?.role === "seller") {
        return {
          slug: loginUserDto["slug"],
          access_token: null,
          role: user.role,
        };
      }

      if (user?.avatar) {
        delete loginUserDto.avatar;
      }

      if (user?.fullName) {
        delete loginUserDto.fullName;
      }

      if (user) {
        loginUserDto["slug"] = user.slug;
      } else {
        loginUserDto["slug"] = UtilSlug.getUniqueId(fullName);
      }

      // console.log(
      //   "🚀 ~ file: users.service.ts:179 ~ UsersService ~ login ~ createUser:",
      //   createUser
      // );

      const accessToken = this.jwtService.sign({
        _id: user._id as string,
        email: user.email,
        role: user.role,
      });

      return {
        slug: loginUserDto["slug"],
        access_token: accessToken,
        userId: user._id as string,
        role: user.role as string,
        email: user.email as string,
        avatar: user.avatar as string,
        fullName: user.fullName as string,
        phone: user.phone || "",
        address: user.address,
      };
    }

    return {
      slug: loginUserDto["slug"],
      access_token: accessToken,
      role: null,
    };
  }

  async adminSellerLogin(loginUserDto: Partial<LoginUserDto>): Promise<
    Partial<User> &
    Partial<{
      slug: string;
      role: string;
      access_token: string | null;
      userId?: string;
    }>
  > {
    console.log("loginUserDto", loginUserDto);
    const { token, tokenType } = loginUserDto;
    let isVerified = false;
    const accessToken = null;

    if (tokenType == "facebook") {
      isVerified = await TokenVerifier.verifyFacebookToken(token);
    } else if (tokenType == "google") {
      isVerified = await TokenVerifier.verifyGoogleToken(token);
      console.log("is verify google", isVerified);
    } else if (tokenType == "email") {
      try {
        const decodedUser = await admin.auth().verifyIdToken(token); // 73-9 token verify hole bhitorer data gulo return korbe
        if (decodedUser?.uid) {
          isVerified = true;
        }
      } catch { }
    }

    console.log({ isVerified, token, tokenType });

    if (isVerified) {
      const { email, fullName, role } = loginUserDto;

      console.log(`email: ${email}`);
      console.log(`fullName: ${fullName}`);
      console.log(`role: ${role}`);

      const user = await this.userModel.findOne({ email: email });

      if (user?.role === "buyer") {
        return {
          slug: loginUserDto["slug"],
          access_token: null,
          role: user.role,
        };
      }

      if (user?.avatar) {
        delete loginUserDto.avatar;
      }

      if (user?.fullName) {
        delete loginUserDto.fullName;
      }

      if (user) {
        loginUserDto["slug"] = user.slug;
      } else {
        loginUserDto["slug"] = UtilSlug.getUniqueId(fullName);
      }

      const createUser = await this.userModel.findOneAndUpdate(
        { email: email },
        {
          $set: {
            ...loginUserDto,
          },
        },
        { upsert: true, new: true }
      );
      console.log(
        "🚀 ~ file: users.service.ts:179 ~ UsersService ~ login ~ createUser:",
        createUser
      );

      const accessToken = this.jwtService.sign({
        _id: createUser._id as string,
        email: createUser.email,
        role: createUser.role,
      });

      return {
        slug: loginUserDto["slug"],
        access_token: accessToken,
        userId: createUser._id as string,
        role: createUser.role as string,
        email: createUser.email as string,
        avatar: createUser.avatar as string,
        fullName: createUser.fullName as string,
        phone: createUser.phone || "",
        address: createUser.address,
      };
    }

    return {
      slug: loginUserDto["slug"],
      access_token: accessToken,
      role: null,
    };
  }

  async findAllCustomers(query: any) {
    console.log(query);
    const allUsers = await this.userModel
      .find({
        role: "buyer",
        fullName: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });
    console.log(allUsers);
    return allUsers;
  }

  async findAllSellers(query: any) {
    const allSellers = await this.userModel
      .find({
        role: "seller",
        status: query.status,
        fullName: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });
    return allSellers;
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findSellerByUser(email: string) {
    return await this.userModel.findOne({ user_email: email });
  }

  async findSingleUser(slug: string) {
    return await this.userModel.findOne({ slug: slug });
  }

  async findUserWithProducts(seller_slug: string) {
    const result = await this.userModel.aggregate([
      {
        $match: {
          slug: seller_slug,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "slug",
          foreignField: "seller_slug",
          as: "sellerProducts",
        },
      },
      // {
      //   $unwind: "$sellerProducts",
      // },
    ]);
    return result[0];
  }

  async update(slug: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(updateUserDto);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { slug: slug },
      updateUserDto,
      {
        new: true,
      }
    );
    // console.log(updatedUser);
    return updatedUser;
  }

  async updateSellerStatus(
    slug: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    console.log(updateUserDto);
    const status = updateUserDto.status;

    const updatedUser = await this.userModel.findOneAndUpdate(
      { slug: slug },
      updateUserDto,
      {
        new: true,
      }
    );

    const updateProducts = await this.productModel.updateMany(
      { seller_slug: slug },
      updateUserDto
    );
    console.log(updatedUser, updateProducts);
    return updatedUser;
  }

  async updateAddress(
    email: string,
    updateUserAddressDto: UpdateUserAddressDto
  ) {
    const address = {
      // avatar: updateUserAddressDto.avatar,

      country: updateUserAddressDto.country,
      city: updateUserAddressDto.city,
      state: updateUserAddressDto.state,
      address: updateUserAddressDto.address,
    };
    const editAddress = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          fullName: updateUserAddressDto.name,
          phone: updateUserAddressDto.phone,
          avatar: updateUserAddressDto.avatar,
          address: address,
        },
      },
      { upsert: true, new: true }
    );

    return editAddress;
  }
  //------------Shop/Profile Data --------------------------
  async updateShop(email: string, updateShopInfoDto: UpdateShopInfoDto) {
    const shopInfo = {
      shop_name: updateShopInfoDto.shop.shop_name,
      shop_address: updateShopInfoDto.shop.shop_address,
      shop_logo: updateShopInfoDto.shop.shop_logo,
      shop_cover: updateShopInfoDto.shop.shop_cover,
      opens_at: updateShopInfoDto.shop.opens_at,
      close_at: updateShopInfoDto.shop.close_at,
      geetings_message: updateShopInfoDto.shop.geetings_message,
      // social_icon: updateShopInfoDto.shop.social_icon,
      // social_link: updateShopInfoDto.shop.social_link,

      social: updateShopInfoDto?.shop?.social,

      seo_title: updateShopInfoDto.shop.seo_title,
      seo_des: updateShopInfoDto.shop.seo_des,
    };
    const editShop = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          fullName: updateShopInfoDto.fullName,
          avatar: updateShopInfoDto.avatar,
          phone: updateShopInfoDto.phone,
          shop: shopInfo,
          // status: updateShopInfoDto.status,
          // role: updateShopInfoDto.role,
        },
      },
      { upsert: true, new: true }
    );

    return editShop;
  }
  //------------Profile Data --------------------------
  async updateProfile(email: string, updateShopInfoDto: UpdateShopInfoDto) {
    const shop = {
      shop_address: updateShopInfoDto.shop.shop_address,
    };
    console.log(updateShopInfoDto, "updateShopInfoDto");
    const editProfile = await this.userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          fullName: updateShopInfoDto.fullName,
          phone: updateShopInfoDto.phone,
          avatar: updateShopInfoDto.avatar,
          shop_address: shop,
        },
      },
      { upsert: true, new: true }
    );

    return editProfile;
  }

  async findAllAdmins(query: any) {
    const allAdmins = await this.userModel
      .find({
        role: "admin",
        fullName: new RegExp(query.search, "i"),
      })
      .sort({ [query.sortBy]: query.sortType });
    // console.log(allUsers);
    return allAdmins;
  }

  //-----------
  async delete(slug: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ slug });
  }

  async deleteAdmin(
    slug: string, //
    email: string
  ): Promise<User> {
    let userData: any;
    let data: any;
    await admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord: string) => {
        // See the UserRecord reference doc for the contents of userRecord.
        userData = JSON.stringify(userRecord);
        data = JSON.parse(userData);
        admin
          .auth()
          .deleteUser(data.uid)
          .then(() => {
            console.log("Successfully deleted user");
          })
          .catch((error) => {
            console.log("Error deleting user:", error);
          });
      })
      .catch((error: string) => {
        console.log("Error fetching user data:", error);
      });

    return await this.userModel.findOneAndDelete({ slug });
  }
}
