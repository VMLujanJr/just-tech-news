async function upvoteClickHandler(event) {
    event.preventDefault();
    /* ...you can find the reference in single-post.handlebar */
    /* You can take a URL string like http://localhost:3001/post/1, split it into an array based on the / character, and then grab the last item in the array. */
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id // references the const id thru window.location
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    }
    else {
        alert(response.statusText);
    }
};

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);