var dictionary = ["흙", "물", "불", "공기"]
var zIndexCounter = 0;


function addElement(ele) {
    document.body.appendChild(makeElement(ele));
}

function makeElement(name) {
    var element = document.createElement("div");
    element.classList.add("elements", "draggable");
    element.innerHTML = name;
    makeElementDraggable(element);
    if (!dictionary.includes(name)) {
        document.getElementById('dics').innerHTML += `<div class="dicsel" onclick="addElement('${name}')">${name}</div>`;
        dictionary.push(name);
    }
    return element;
}

function makeElementDraggable(element) {
    var isDragging = false;
    var offset = { x: 0, y: 0 };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mousemove", handleMouseMove);

    function handleMouseDown(event) {
        isDragging = true;
        zIndexCounter += 1;
        offset.x = event.offsetX;
        offset.y = event.offsetY;

        element.style.zIndex = zIndexCounter;

    }

    function handleMouseUp() {
        isDragging = false;

        var draggableElements = document.getElementsByClassName("draggable");

        for (var i = 0; i < draggableElements.length; i++) {
            var otherElement = draggableElements[i];

            if (otherElement !== element && isHalfColliding(element, otherElement)) {
                combineElements(element, otherElement);
                return;
            }
        }
    }

    function handleMouseMove(event) {
        if (!isDragging) return;

        var x = event.clientX - offset.x;
        var y = event.clientY - offset.y;

        element.style.left = x + "px";
        element.style.top = y + "px";
    }
}



function isHalfColliding(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var halfWidth1 = rect1.width / (2 * Math.sqrt(2));
    var halfWidth2 = rect2.width / (2 * Math.sqrt(2));

    let center1 = [rect1.left + halfWidth1, rect1.top + halfWidth1]
    let center2 = [rect2.left + halfWidth2, rect2.top + halfWidth2]

    var distance = Math.sqrt((center1[0] - center2[0]) ** 2 + (center1[1] - center2[1]) ** 2);

    return (
        distance <= halfWidth1 + halfWidth2
    );
}

function combineElements(element1, element2) {
    var combinedElement;

    if (mergeEvent(element1.innerHTML, element2.innerHTML, "bool")) {
        combinedElement = makeElement(mergeEvent(element1.innerHTML, element2.innerHTML, "result"));
    }

    document.body.appendChild(combinedElement);

    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var combinedX = Math.min(rect1.left, rect2.left);
    var combinedY = Math.min(rect1.top, rect2.top);

    combinedElement.style.left = combinedX + "px";
    combinedElement.style.top = combinedY + "px";

    element1.remove();
    element2.remove();
}


function mergeEvent(e1, e2, m) {
    if (m == "bool") {
        for (let i = 0; i < recipe.length; i++) {
            if ((recipe[i][0] == e1 && recipe[i][1] == e2) || (recipe[i][0] == e2 && recipe[i][1] == e1)) {
                return true;
            }
        }

    } else if (m == "result") {
        for (let i = 0; i < recipe.length; i++) {
            if ((recipe[i][0] == e1 && recipe[i][1] == e2) || (recipe[i][0] == e2 && recipe[i][1] == e1)) {
                return recipe[i][2];
            }
        }
    }
}