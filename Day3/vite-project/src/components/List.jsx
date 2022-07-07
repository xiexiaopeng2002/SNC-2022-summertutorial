import { useState } from "react"
import { useEffect } from "react"
export default function MyList(props) {
    const [posts, setPosts] = useState([])
    const url = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
    useEffect(() => {
        fetch(url).then(res => {
            return res.json();
        }).then(json => {
            const list = json.slice(0, 10)
            Promise.all(list.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`).then(res => res.json()))).then(posts => { setPosts(posts) })
        })
    }, [])
    return (
        <div className="content">
            {posts.map((post, index) => <ListItem posts={post} key={index}></ListItem>)}
        </div>
    )
}
function ListItem(props) {
    const posts = props.posts
    return (
        <div className="tmp" id="tmp">
            <span className="passage-id">{posts.score}</span>
            <span>
                <span>{posts.title} <a href="#">({posts.url === undefined ? "Not Found" : posts.url.split('/')[2]})</a></span><br></br>
                <span>by <span>{posts.by}</span> <span>{parseInt((new Date().getTime() / 1000 - posts.time) / 60, 10)}</span> days ago | <span>{posts.descendants}</span> comments</span>
            </span>
        </div>
    )
}