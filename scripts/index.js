const collapsibles = document.querySelectorAll(".app-features-collapsible");
collapsibles.forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("app-features-active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null; // collapse
    } else {
      content.style.maxHeight = 200 + "px"; // expand
    }
  });
});

const toggles = document.querySelectorAll('.group-toggle');

toggles.forEach(toggle => {
  toggle.addEventListener('click', function () {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

document.getElementById('tools-btn').addEventListener('click', ()=>{
    const container = document.getElementById('app-features-container');
    if(container.style.display=='' || container.style.display=='none'){
        document.getElementById('tools-btn').classList.add('genz-button-active');
        container.style.display='block';
    }else{
        document.getElementById('tools-btn').classList.remove('genz-button-active');
        container.style.display='none';
    }    
});