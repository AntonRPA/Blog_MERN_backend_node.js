import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,	//Обязательное свойство при создание документа
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,	//тип _id как в БД
			ref: 'User',	//Делаем связь между 2 таблицами
			required: true,
		},		
		imageUrl: String,
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Post', PostSchema);