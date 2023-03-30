import { Router, Request, Response } from 'express';
import jwt, { Jwt, JwtPayload, Secret } from 'jsonwebtoken';
import Category, { ICategory } from '../models/category';
import { userExtractor } from '../utils/middleware';
import User, { UserDoc } from '../models/user';
import { DecodedToken } from '../types/decodedToken';
import CategoryRequest from '../types/categoryRequest';



const categoriesRouter: Router = Router();

categoriesRouter.get('/', async (request: Request, response: Response) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          isDefault: false,
        },
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'category',
          as: 'transactions',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          _id: 1,
          category_name: 1,
          user: {
            $arrayElemAt: ['$user', 0],
          },
          transactions: 1,
          transaction_count: {
            $size: '$transactions',
          },
        },
      },
    ]);
    response.json(categories);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});

categoriesRouter.get('/default', userExtractor, async (request: CategoryRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!('id' in decodedToken)) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const categories = await Category.find({ user: decodedToken.id, isDefault: true });
  response.json(categories);
});


categoriesRouter.post('/', userExtractor, async (request: CategoryRequest, response: Response) => {
  const user = request.user;
  const body = request.body;
  if (!body.category_name) {
    return response.status(400).json({ error: 'name is missing' });
  }

  const category = new Category({
    category_name: body.category_name,
    user: user ? user._id : undefined,
  });

  const savedCategory = await category.save();
  if (user) {
    if (!user.categories) {
      user.categories = [savedCategory._id];
    } else {
      user.categories = user.categories.concat(savedCategory._id);
    }
    await user.save();
  }

  response.status(201).json(savedCategory);
});

categoriesRouter.delete('/:id', userExtractor, async (request: CategoryRequest, response: Response) => {
  if (typeof request.token !== 'string') {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }
  
  const decodedToken: any = jwt.verify(request.token, process.env.SECRET as Secret);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const category = await Category.findById(request.params.id);
  if (!category) {
    return response.status(404).json({ error: 'category not found' });
  }

  if (category.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the category can delete it' });
  }

  category.isDefault = true;
  await category.save();

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }


  if(!user.categories){
    return response.status(401).json({ error: 'undefined categories' });
  }

  user.categories = user.categories.filter((cat: any) => cat.toString() !== request.params.id);
  await user.save();


  response.status(204).end();
});

categoriesRouter.put('/:id', (request: CategoryRequest, response: Response) => {
  const { category_name } = request.body
  Category.findByIdAndUpdate<ICategory>(
    request.params.id,
    { category_name },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedCategory: ICategory | null) => {
      if (updatedCategory) {
        response.json(updatedCategory)
      } else {
        response.status(404).json({ error: 'Category not found' })
      }
    })
})

export default categoriesRouter
