document.getElementById("addBlogBtn").onclick = function () {
    $("#blogModal").modal("show");
};

document.getElementsByClassName("close")[0].onclick = function () {
    $("#blogModal").modal("hide");
};

document.getElementById("addBlogForm").onsubmit = async function (event) {
    event.preventDefault();

    const title = document.getElementById("blogTitle").value;
    const poster = document.getElementById("blogPoster").value;
    const description = document.getElementById("blogDescription").value;
    const content = document.getElementById("blogContent").value;
    const imageInput = document.getElementById("blogImage");

    if (title && poster && description && content) {
        const blogData = {
            title,
            poster,
            description,
            content,
        };

        // Send the blog data to the server
        try {
            const response = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blogData)
            });

            if (response.ok) {
                const newBlog = await response.json();
                addBlogToList(newBlog._id, newBlog); // Use the new blog ID from MongoDB
                showSuccessMessage();
                document.getElementById("addBlogForm").reset();
                $("#blogModal").modal("hide");
            } else {
                showErrorMessage();
            }
        } catch (error) {
            console.error('Error adding blog:', error);
            showErrorMessage();
        }
    } else {
        showErrorMessage();
    }
};

function addBlogToList(id, blogData) {
    const blogList = document.getElementById("blogList");
    const blogPost = document.createElement("div");
    blogPost.classList.add("blog-post", "p-3", "bg-light", "rounded");
    blogPost.innerHTML = `
          <h3>${blogData.title}</h3>
          <p>${blogData.description}</p>
          <button class="btn btn-info" onclick="viewBlog('${id}')">Read More</button>
      `;
    blogList.appendChild(blogPost);
}

function viewBlog(id) {
    window.location.href = `blog.html?id=${id}`;
}

window.onload = async function () {
    try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        blogs.forEach(blog => {
            addBlogToList(blog._id, blog);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
};

function showSuccessMessage() {
    const successMessage = document.getElementById("successMessage");
    successMessage.classList.remove("d-none");
    setTimeout(() => successMessage.classList.add("d-none"), 3000);
}

function showErrorMessage() {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.remove("d-none");
    setTimeout(() => errorMessage.classList.add("d-none"), 3000);
}
