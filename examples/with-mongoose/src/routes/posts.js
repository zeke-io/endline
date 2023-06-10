import Post from '../models/post'

/** @param {import('endline').Router} router */
export default function (router) {
  // GET /posts
  router.GET('/', getAllPosts)
  // POST /posts
  router.POST('/', createPost)
  // GET /posts/{id}
  router.GET('/:id', getPostById)
  // PUT /posts/{id}
  router.PUT('/:id', updatePost)
  // DELETE /posts/{id}
  router.DELETE('/:id', deletePost)
}

/**
 * Gets all posts
 */
async function getAllPosts() {
  const posts = await Post.find()

  return {
    status: 200,
    body: posts,
  }
}

/**
 * Creates a new post
 *
 * @param {import('endline').HandlerContext} context
 */
async function createPost({ body }) {
  const { title, content } = body

  const newPost = new Post({ title, content })
  const result = await newPost.save()

  return {
    status: 201,
    body: result,
  }
}

/**
 * Gets a post with the given id
 *
 * @param {import('endline').HandlerContext} context
 */
async function getPostById({ params }) {
  const { id } = params
  const post = await Post.findById(id)

  return {
    status: 200,
    body: post,
  }
}

/**
 * Updates a post with the given id
 *
 * @param {import('endline').HandlerContext} context
 */
async function updatePost({ params, body }) {
  const { id } = params

  const updatedPost = await Post.findByIdAndUpdate(id, body, { new: true })

  return {
    status: 200,
    body: updatedPost,
  }
}

/**
 * Deletes a post with the given id
 *
 * @param {import('endline').HandlerContext} context
 */
async function deletePost({ params }) {
  const { id } = params

  const deletedPost = await Post.findByIdAndDelete(id)

  return {
    status: 200,
    body: deletedPost,
  }
}
