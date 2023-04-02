import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

//Create comment
export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.post,
    });
    const comment = await doc.save();

    //Обновлям количество комментариев к посту (увеличиваем +1)
    PostModel.findOneAndUpdate(
      {
        _id: req.body.post,
      },
      {
        $inc: { commentsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        console.log(doc);
      },
    );

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

//Get all comments
export const getAllComment = async (req, res) => {
  try {
    //Сортировка по дате по возврастанию
    const comments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName avatarUrl')
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить все комментарии',
    });
  }
};

//Get комментарии для конкретной статьи
export const getCommentsPost = async (req, res) => {
  try {
    const id = req.params.id;
    //Оператор $elemMatch позволяет выбрать документы, в которых массивы содержат элементы
    //Ищет объекты, один из тегов которых "$eq - равен" значению postTag
    const comments = await CommentModel.find({ post: { $eq: id } })
      .sort({ createdAt: -1 })
      .populate('user', 'fullName avatarUrl')
      .exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии к статьи',
    });
  }
};

//Get Quantity comments
export const getQuantityComment = async (req, res) => {
  try {
    const quantity = req.params.quantity;
    //Сортировка по дате по возврастанию
    const comments = await CommentModel.find()
      .sort({ createdAt: -1 })
      .limit(quantity)
      .populate('user', 'fullName avatarUrl')
      .exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить указанное количество комментариев',
    });
  }
};
