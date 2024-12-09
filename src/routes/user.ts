
import { FastifyInstance, FastifyRequest } from "fastify";
import { db } from '../lib/prisma'

export async function users(app: FastifyInstance) {

  type MyRequestSignIn = FastifyRequest<{
    Body: {
      email: string
      password: string
    }
  }>

  type MyRequestPost = FastifyRequest<{
    Body: {
      name: string
      email: string
      password: string
    }
  }>

  app.post('/create-user', async (request: MyRequestPost) => {

    const { name, email, password } = request.body

    if (!name) {
      return new Error('name is required')
    }

    if (!email) {
      return new Error('email is required')
    }

    if (!password) {
      return new Error('password is required')
    }

    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: password
      }
    })
    return user
  })

  app.post('/user-sign-in', async (request: MyRequestSignIn, reply) => {

    const { email, password } = request.body

    if (!email) {
      return new Error('email is required')
    }

    if (!password) {
      return new Error('password is required')
    }

    const user = await db.user.findFirst({
      where: {
        email: email
      }
    })

    if (user?.password !== password) {
      return reply.status(401).send({ message: 'email or password is incorrect' })
    }

    return reply.status(200).send({ 
      userId: user.id
     })
  })

}
