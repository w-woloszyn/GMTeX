function generateUniqueId() {
  return Date.now().toString(36);
}

async function replaceLatexWithRenderedImages(target) {
  const latexPattern = /\$\$([^\$]+)\$\$/g;
  const savedSelection = window.getSelection().getRangeAt(0).cloneRange();
  const selectionParentNode = savedSelection.startContainer.parentNode;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = target.innerHTML;
  let replaced = false;

  tempDiv.innerHTML = await tempDiv.innerHTML.replaceAsync(latexPattern, async (match, latexCode) => {
    const imageUrl = `https://latex.codecogs.com/png.latex?\\dpi{300}${encodeURIComponent(latexCode)}`;
    replaced = true;
    const uniqueId = generateUniqueId();
    const img = new Image();
    img.src = imageUrl;
    img.alt = latexCode;
    img.setAttribute('data-unique-id', uniqueId);

    return new Promise(resolve => {
      img.onload = function () {
        const originalHeight = this.naturalHeight;
        const scaledHeight = Math.round(originalHeight * 0.39);
        this.style.height = scaledHeight + 'px';
        resolve(img.outerHTML);
      };
    });
  });

  if (replaced) {
    target.innerHTML = tempDiv.innerHTML;

    const images = target.querySelectorAll('img');
    let lastImage;
    let lastImageIndex = -1;
    for (const img of images) {
      const imgId = img.getAttribute('data-unique-id');
      const imgIndex = Array.from(img.parentNode.childNodes).indexOf(img);
      if ((lastImage === undefined) || (imgId > lastImage.getAttribute('data-unique-id')) || (imgId === lastImage.getAttribute('data-unique-id') && imgIndex > lastImageIndex)) {
        lastImage = img;
        lastImageIndex = imgIndex;
      }
    }

    const range = document.createRange();
    range.setStartAfter(lastImage);
    range.collapse(true);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}

function onInput(event) {
  const emailBody = event.target;
  replaceLatexWithRenderedImages(emailBody);
}

function attachToEmailBody() {
  const emailBody = document.querySelector("[contenteditable='true']");
  if (emailBody) {
    emailBody.removeEventListener('input', onInput);
    emailBody.addEventListener('input', onInput);
    return true;
  }
  return false;
}

function init() {
  if (!attachToEmailBody()) {
    const observer = new MutationObserver(() => {
      if (attachToEmailBody()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

init();
window.addEventListener("hashchange", init);

// Add replaceAsync function to the String prototype
String.prototype.replaceAsync = async function (regexp, asyncFn) {
  const matches = [];
  this.replace(regexp, (...args) => {
    matches.push(args);
  });
  const replacements = await Promise.all(matches.map(match => asyncFn(...match)));
  return this.replace(regexp, () => replacements.shift());
};
