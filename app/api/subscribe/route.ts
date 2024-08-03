import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import webpush from 'web-push'

let mongoClient: MongoClient | null = null

async function connectToDatabase() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string)
    await mongoClient.connect()
  }
  return mongoClient.db('your_database_name')
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const subscription = req.body
    const db = await connectToDatabase()
    await db.collection('subscriptions').insertOne(subscription)
    res.status(201).json({})
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}