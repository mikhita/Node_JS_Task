const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

categoriesRouter.get('/', async (request, response) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'transactions',
          localField: '_id',
          foreignField: 'category',
          as: 'transactions'
        }
      },
      {
        $project: {
          _id: 1,
          category_name: 1,
          user: 1,
          transactions: 1
        }
      }
    ]);
    response.json(categories);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});


categoriesRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body
  if (!body.category_name) {
    return response.status(400).json({ error: 'name is missing' })
  }

  const category = new Category({
    category_name: body.category_name,
    user: user._id
  })

  const savedCategory = await category.save()
  user.categories = user.categories.concat(savedCategory._id)
  await user.save()
  
  response.status(201).json(savedCategory)
})

categoriesRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const category = await Category.findById(request.params.id)
  if (!category) {
    return response.status(404).json({ error: 'category not found' })
  }
  
  if (category.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the category can delete it' })
  }

  await Category.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

categoriesRouter.put('/:id', (request, response) => {
  const { category_name } = request.body
  Category.findByIdAndUpdate(
    request.params.id,
    { category_name },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedCategory) => {
      response.json(updatedCategory)
    })
})

module.exports = categoriesRouter