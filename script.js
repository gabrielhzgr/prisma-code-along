import { PrismaClient } from "./generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"
import {getUsersWithPosts} from "./generated/prisma/sql/getUsersWithPosts.js"
import {getUsersByAge} from "./generated/prisma/sql/getUsersByAge.js"
import {getUsersByIds} from "./generated/prisma/sql/getUsersByIds.js"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({adapter})



async function main(){
    /* Already created on previous execution, email is unique for User model
    const user = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@prisma.io',
            posts: {
                create: { title: 'Join us for Prisma Day 2020'}
            }
        }
    })
    
    const user2 = await prisma.user.create({
        data: {
            name: 'Gabriel',
            email: 'gabriel@prisma.io',
            posts: {
                create: { title: 'Using prisma', content: 'Prisma is an ORM, a very interesting one'}
            }
        }
    })
    */

    const allUsers = await prisma.user.findMany({include: {posts:true}})
    console.log('----- All users, include posts relation -----');
    console.log(JSON.stringify(allUsers,null,2));

    /* New post without prisma in title or content
    const post2 = await prisma.post.create({
        data: {
            title: 'World Cup',
            content: 'Begins on June 10',
            authorId: 2
        }
    })*/
    
    const filteredPosts = await prisma.post.findMany({
        where: {
            OR: [{title: {contains: "prisma", mode: "insensitive"}}, {content: {contains: "prisma", mode: "insensitive"}}]
        },
    })
    console.log('----- Filtered posts wich contain prisma word in title or content -----');
    console.log(filteredPosts);

    const allPosts = await prisma.post.findMany()
    console.log('----- All posts -----');
    console.log(allPosts);

    /* Already created on previous execution, email is unique for User model
    console.log('----- Update World Cup post -----');
    const post = await prisma.post.update({
        where: {id: 3},
        data: {published: true, title: 'The 2026 FIFA World Cup'}
    })

    console.log(await prisma.post.findMany()); 
    */
    
    /*
    console.log('--- New User with posts with categories ---');
    const user3 = await prisma.user.create({
        data: {
            email: 'ariadne@prisma.io',
            name: 'Ariadne',
            posts: {
                create: [
                    {
                        title: 'My first day at Prisma',
                        categories: { create: { name: 'Office' } },
                    },
                    {
                        title: 'How to connect to a SQLite database',
                        categories: { create: [{ name: 'Databases' }, { name: 'Tutorials' }]}
                    },
                ],
            },
        },
    })
    */
    console.log(JSON.stringify(await prisma.user.findMany({
        include: {posts:{
            include: {categories: true}
            } 
        }
    }), null, 2));

    // typed sql / raw sql
    const usersWithPostCounts = await prisma.$queryRawTyped(getUsersWithPosts())
    console.log('----- Typed SQL / Raw  SQL: Count user posts-----');

    console.log(usersWithPostCounts);

    const usersByAge = await prisma.$queryRawTyped(getUsersByAge(18, 30))

    await prisma.user.update({
        where: {email: 'gabriel@prisma.io'},
        data: {age: 24},
    })

    await prisma.user.update({
        where: {email: 'alice@prisma.io'},
        data: {age: 20}
    })

    await prisma.user.update({
        where: {email: 'ariadne@prisma.io'},
        data: {age: 17}
    })
    console.log('----- Typed SQL / Raw  SQL: Users with age 18 to 30 -----');
    console.log(usersByAge);

    console.log('----- Typed SQL / Raw  SQL: Users under age 18 -----');
    console.log(await prisma.$queryRawTyped(getUsersByAge(0,18)));

    console.log('----- Typed SQL / Raw  SQL: Users by Ids [1,2]-----');
    const usersByIds = await prisma.$queryRaw(getUsersByIds([1,2]))
    console.log(usersByIds);

  
    
    console.log('----- Typed SQL / Raw  SQL: Users by Ids [3,4]-----');
    
    console.log(await prisma.$queryRaw(getUsersByIds([3,4])));
}   

main()