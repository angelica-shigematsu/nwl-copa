import Fastify from 'fastify'
import {PrismaClient} from '@prisma/client'
import cors from '@fastify/cors'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'
const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    logger: true, //-> retorna alguma erro na aplicação
  })

  await fastify.register(cors, {
    origin: true,
  })
  
  fastify.get('/pools/count', async() => {
    const pools = await prisma.pool.count()
    return { pools }
  })

  fastify.post('/pools', async(request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    })
    
    try{
      const { title } = createPoolBody.parse(request.body)
      
      const generate = new ShortUniqueId({ length: 6 })
      
      const code = String(generate()).toLocaleUpperCase()
      await prisma.pool.create({
        data: {
          title,
          code 
        }
      })
      
      return reply.status(201).send({ code })
    }catch(err){
      return reply.status(401).send('Título nulo')
    }    
  })
  fastify.get('/guesses/count', async() => {
    const pools = await prisma.pool.count()
    return { pools }
  })

  fastify.get('/users/count', async() => {
    const pools = await prisma.pool.count()
    return { pools }
  })

  await fastify.listen({ port: 3333 })
}

bootstrap()