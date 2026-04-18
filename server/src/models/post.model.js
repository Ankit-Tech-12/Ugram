import mongoose, {Schema} from "mongoose"

const postSchema = new Schema({
   image: {
      type: String, // Cloudinary URL
      required: true,
    },

    caption: {
      type: String,
      trim: true,
      default: "",
    },

    views: {
        type: Number,
        default: 0,
    },
    
    // isPublished: {
    //     type: Boolean,
    //     default: true,
    // },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index :true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
},{timestamps:true})

export const Post=mongoose.model("Post",postSchema)