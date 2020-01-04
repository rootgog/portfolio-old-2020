window.onload = () => {
  let projects;

  fetch("/assets/json/projects.json")
    .then(response => {
      return response.json();
    })
    .then(data => {
      projects = data;
    });

  //define router and its routes
  let router = new Router();

  router
    .on(
      "projects",
      new Router()
        .on(() => {
          //projects page
          loadContent("assets/pages/projects.html");
        })
        .on("*", () => {
          //individual project page
          loadContent("assets/pages/project.html", () => {
            let title = document.querySelector(".title");
            let subheading = document.querySelector(".subheading");
            let desc = document.querySelector(".desc");
            let images = document.querySelector(".images");
            let tech = document.querySelector(".tech");
            let links = document.querySelector(".links");

            let project = (window.location.pathname[0] == "/"
              ? window.location.pathname.substr(1)
              : window.location.pathname
            ).split("/")[1];
            let data = projects[project];

            //static data
            title.innerHTML = data.title;
            subheading.innerHTML = data.subheading;
            desc.innerHTML = data.description;

            //custom data

            //images
            data.images.forEach(img => {
              images.innerHTML += `<img src="/assets/img/projects/volume/${img}">`;
            });

            //technologies
            data.technologies.forEach(technology => {
              switch (technology.toLowerCase()) {
                case "node":
                case "nodejs":
                case "node.js":
                  technology = `<img src="/assets/img/logos/node.png" alt="Node.js" title="Node.js">`;
                  break;
                case "html":
                  technology = `<img src="/assets/img/logos/html.png" alt="HTML" title="HTML">`;
                  break;
                case "css":
                  technology = `<img src="/assets/img/logos/css.png" alt="CSS" title="CSS">`;
                  break;
                case "javascript":
                  technology = `<img src="/assets/img/logos/javascript.png" alt="JavaScript" title="JavaScript">`;
                  break;
              }
              tech.innerHTML += technology;
            });

            //links
            data.links.forEach(link => {
              let text = link;
              if (link.includes("//github.")) {
                text = `<img src="/assets/img/logos/Github-Mark-64px.png">`;
              }
              links.innerHTML += `<a href=${link}>${text}</a>`;
            });
          });
        })
    )
    .on(() => {
      //load home
      loadContent("./assets/pages/home.html");
    })
    .on("contact", () => {
      //contact page
      loadContent("assets/pages/contact.html");
    })
    .on("about", () => {
      //about page
      loadContent("assets/pages/about.html");
    })
    .notFound(() => {
      loadContent("assets/pages/404.html");
    })
    .resolve({
      seturl: false
    });

  window.addEventListener("click", e => {
    let target = e.target;
    while (target.localName !== "a") {
      target = target.parentNode;
      if (!target) return;
    }
    let link = target.getAttribute("href");
    if (
      link &&
      !link.startsWith("https://") &&
      !link.startsWith("http://") &&
      !link.startsWith("mailto:")
    ) {
      e.preventDefault();
      router.sendTo({
        path: link
      });
      return false;
    }
  });

  window.addEventListener("popstate", () => {
    //needs fixing
    router.resolve({
      seturl: false
    });
  });
};

function loadContent(path, callback = false) {
  fetch("/" + path)
    .then(res => {
      return res.text();
    })
    .then(data => {
      document.querySelector(".content").innerHTML = data;
    })
    .then(() => {
      if (callback) {
        callback();
      }
    })
    .catch(err => {
      console.log(err);
    });
}
