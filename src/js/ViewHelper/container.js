const ContainerHelper = (() => {
    function removeWoodenContainer(containerElement) {
        return new Promise((resolve) => {
            containerElement.classList.remove("active");
            containerElement.addEventListener("transitionend", (e) => {
                if (e.propertyName === "bottom") {
                    containerElement.remove();
                    resolve();
                }
            });
        });
    }

    function displayWoodenContainer(parentElement, containerElement) {
        parentElement.append(containerElement);
        setTimeout(() => {
            containerElement.classList.add("active");
        }, 25);
    }

    function createPauseContainer() {
        const pauseContainerElement = document.createElement("div");
        pauseContainerElement.classList.add("pause-container");
        return pauseContainerElement;
    }

    return {
        removeWoodenContainer,
        displayWoodenContainer,
        createPauseContainer,
    };
})();

export default ContainerHelper;
