import { useState } from "react"
import { useEffect } from "react"
import Ajv, { JSONSchemaType } from "ajv"
import { Type } from "ajv/dist/compile/util"

const ajv = new Ajv({
    int32range: false
})

type Post = {
    score: number,
    title: string,
    url?: string,
    by: string,
    time: number,
    kids?: Array<number>
}

export default function MyList() {
    const [posts, setPosts] = useState<Post[]>([])
    const url = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
    useEffect(() => {
        fetch(url).then(res => res.json()).then(json => {
            // 验证Array是否为整数数组
            const list = json.slice(0, 10)
            type IDArray = Array<number>
            // 验证法则
            const schema: JSONSchemaType<IDArray> = {
                type: "array",
                items: {
                    type: "integer"
                }
            }
            const validator = ajv.compile(schema)
            if (validator(list)) {
                const posts = Promise.all(list.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then(res => res.json())))
                return posts;
            } else {
                throw new Error("Invalid ID Array!")
            }
        }).then(posts => {
            // 验证posts结构
            type Posts = Array<Post>
            const schema: JSONSchemaType<Posts> = {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        score: { type: "integer" },
                        title: { type: "string" },
                        url: { type: "string", nullable: true },
                        by: { type: "string" },
                        time: { type: "integer" },
                        kids: { type: "array", items: { type: "integer" }, nullable: true }
                    },
                    required: ["score", "title", "by", "time"]
                }
            }
            const validator = ajv.compile(schema)
            if (validator(posts)) return posts;
            else throw new Error("Invalid Posts Structure!")
        }).then(posts => {
            setPosts(posts)
        }).catch(err => console.log(err))
    }, [])

    return (
        <div className="content">
            {posts.map((post, index) => <ListItem post={post} key={index}></ListItem>)}
        </div>
    )
}
function ListItem(props: { post: Post }) {
    const posts = props.post
    const now = Math.round(new Date().getTime() / 1000)
    const time = Math.floor((now - posts.time) / 86400)
    return (
        <div className="tmp" id="tmp">
            <span className="passage-id">{posts.score}</span>
            <span>
                <span>{posts.title} <a href="#">({posts.url === undefined ? "Not Found" : posts.url.split('/')[2]})</a></span><br></br>
                <span>by <span>{posts.by}</span> <span>{time}</span> days ago | <span>{posts.kids?.length}</span> comments</span>
            </span>
        </div>
    )
}
// function Title(props:{url?:string,title:string}){
//     const {url,title} = props
//     return
// }