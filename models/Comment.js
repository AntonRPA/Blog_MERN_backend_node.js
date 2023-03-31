import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, //тип _id как в БД
      ref: 'User', //Делаем связь между 2 таблицами
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId, //тип _id как в БД
      ref: 'Post', //Делаем связь между 2 таблицами
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Comment', CommentSchema);
