
        // File upload file
        const fileInput = document.querySelector("#file-upload");
        const fileText = document.querySelector(".file-text");

        fileInput.parentElement.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", function () {
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                fileText.innerHTML = `<i class="fas fa-check-circle"></i><br>${fileName}`;
                fileInput.closest(".custom-file-upload").classList.add("file-selected");
            } else {
                fileText.innerHTML = `<i class="fas fa-cloud-upload-alt"></i><br>Click to Upload or drag & drop`;
                fileInput.closest(".custom-file-upload").classList.remove("file-selected");
            }
        });
// ---------------------------------------------
        // Bootstrap form validation error
        (() => {
            const forms = document.querySelectorAll(".needs-validation");
            Array.from(forms).forEach((form) => {
                form.addEventListener(
                    "submit",
                    (event) => {
                        if (!form.checkValidity()) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add("was-validated");
                    },
                    false
                );
            });
        })();              