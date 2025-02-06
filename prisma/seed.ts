import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'test@test.com',
    name: 'Alice',
    
  }
]

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u })
  }
}

main()