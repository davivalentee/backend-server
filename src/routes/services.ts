import { FastifyInstance, FastifyRequest } from "fastify";
import { db } from '../lib/prisma'

export async function services(app: FastifyInstance) {

  type MyRequest = FastifyRequest<{
    Querystring: { 
      userId: string
     }
  }>

  type MyRequestDelete = FastifyRequest<{
    Querystring: { 
      userId: string
      id: string
     }
  }>
  
  type MyRequestPut = FastifyRequest<{
    Querystring: {
      userId: string
      id: string
    }
    Body: {
      name?: string
      price?: number
      description?: string
    }
  }>
  
  type MyRequestPost = FastifyRequest<{
    Body: {
      name: string
      price: number
      description: string
      userId
    }
  }>

  app.post('/create-service', async (request: MyRequestPost) => {

    const { name, price, description, userId } = request.body

    if (!name) {
      return new Error('name is required')
    }

    if (!price) {
      return new Error('price is required')
    }

    if (!description) {
      return new Error('description is required')
    }

    if (!userId) {
      return new Error('userId is required')
    }

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return new Error('user not found')
    }

    const service = await db.services.create({
      data: {
        name: name,
        price: price,
        description: description,
        userId: userId
      }
    })
    return service
  })
  
  app.get('/get-services-by-user', async (request: MyRequest) => {

    let userId = request.query.userId;

    if (!userId) {
      return new Error('userId is required')
    }

    const services = await db.services.findMany({
      where: {
        userId: userId
      }
    })
    return services
  })

  app.delete('/delete-service', async (request: MyRequestDelete) => {
    
    const userId = request.query.userId;
    const id = request.query.id;

    const service = await db.services.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!service) {
      return new Error('service not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    await db.services.delete({
      where: {
        id,
        userId
      }
    })

  })

  app.put('/update-service', async (request: MyRequestPut) => {

    const userId = request.query.userId;
    const id = request.query.id;

    const { name, description, price } = request.body

    const service = await db.services.findUnique({
      where: {
        id
      }
    })

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!service) {
      return new Error('service not found')
    }

    if (!user) {
      return new Error('user not found')
    }

    const updatedService = await db.services.update({
      where: {
        id,
        userId
      },
      data: {
        name: name || service.name,
        description: description || service.description,
        price: price || service.price
      }
    })

    return updatedService

  })

}