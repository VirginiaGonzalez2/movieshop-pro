document.querySelectorAll(".post").forEach((post) => {
    const url = post.getAttribute("data-url");
    const title = post.getAttribute("data-title");

    const share = post.querySelector(".a2a_kit");
    share.dataset.a2aUrl = url;
    share.dataset.a2aTitle = title;
});
