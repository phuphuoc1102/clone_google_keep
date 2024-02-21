class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.title = "";
        this.text = "";
        this.id = "";
        this.$placeholder = document.querySelector("#placeholder");
        this.$form = document.querySelector("#form");
        this.$notes = document.querySelector("#notes");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$formButtons = document.querySelector("#form-buttons");
        this.$formCloseButton = document.querySelector("#form-close-button");
        this.$modal = document.querySelector(".modal");
        this.$modalTitle = document.querySelector(".modal-title");
        this.$modalText = document.querySelector(".modal-text");
        this.$modalCloseButton = document.querySelector(".modal-close-button");
        this.render();
        this.addEventListeners();
    }
    addEventListeners() {
        document.body.addEventListener("click", (event) => {
            this.handleFormClick(event);
            this.selectNote(event);
            this.openModal(event);
            this.deleteNote(event);
            this.editNote(event);
        });

        document.body.addEventListener("mouseover", (event) => {
            this.openTooltip(event);
        });

        document.body.addEventListener("mouseout", (event) => {
            this.closeTooltip(event);
        });


        this.$form.addEventListener("submit", (event) => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            const hasNote = title || text;
            if (hasNote) {
                this.addNote({ title, text });
            }
        });

        this.$formCloseButton.addEventListener("click", (event) => {
            //stops event from proagating as there is a bug that prevents the form from closing
            event.stopPropagation();
            this.closeForm();
        });

        this.$modalCloseButton.addEventListener("click", (event) => {
            this.closeModal();
            console.log("it's closing!");
        });
    }

    handleFormClick(event) {
        const isFormClicked = this.$form.contains(event.target);
        // const title = this.$noteTitle.value;
        // const text = this.$noteText.value;
        // const hasNote = title || text;

        if (isFormClicked) {
            this.openForm();
            // } else if (hasNote) {
            //     this.addNotes({ title, text });
        } else {
            this.closeForm();
        }
    }
    openForm() {
        this.$form.classList.add(".form-open");
        this.$noteTitle.style.display = "block";
        this.$formButtons.style.display = "block";
    }

    closeForm() {
        this.$form.classList.remove(".form-open");
        this.$noteTitle.style.display = "none";
        this.$formButtons.style.display = "none";
        this.$noteTitle.value = "";
        this.$noteText.value = "";
    }

    openModal(event) {

        if (event.target.matches('.toolbar-delete')) return;
        if (event.target.closest(".note")) {
            this.$modal.classList.toggle("open-modal");
            this.$modalTitle.value = this.title;
            this.$modalText.value = this.text;
        }
    }

    closeModal() {
        this.editNote();
        this.$modal.classList.toggle("open-modal");
    }

    addNote({ title, text }) {
        //note data
        const newNote = {
            title,
            text,
            id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
        };

        this.notes = [...this.notes, newNote];
        this.render();
        this.closeForm();

        console.log(this.notes);
    }

    editNote() {
        if (!this.id) {
            console.error("Chưa chọn ghi chú để chỉnh sửa.");
            return;
        }

        const titleVal = this.$modalTitle.value;
        const textVal = this.$modalText.value;
        console.log(this.id);
        // Chỉnh sửa ghi chú trong mảng notes
        this.notes = this.notes.map((note) =>
            note.id === Number(this.id) ? {...note, title: titleVal, text: textVal } : note
        );

        this.render();
        console.log(this.notes);
    }

    selectNote(event) {
        const $selectedNote = event.target.closest(".note");
        if (!$selectedNote) return;
        const [$noteTitle, $noteText] = $selectedNote.children;
        this.title = $noteTitle.innerText;
        this.text = $noteText.innerText;
        this.id = $selectedNote.dataset.id;
    }



    deleteNote(event) {
        event.stopPropagation();
        if (!event.target.matches('.toolbar-delete')) return;
        const id = event.target.dataset.id;
        this.notes = this.notes.filter(note => note.id !== Number(id));
        this.render();
    }

    render() {
        this.saveNotes();
        this.displayNotes()

    }
    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }

    displayNotes() {
        const hasNotes = this.notes.length > 0;
        if (hasNotes) {
            this.$placeholder.style.display = "none";
        } else {
            this.$placeholder.style.display = "flex";
        }

        this.$notes.innerHTML = this.notes
            .map(
                (note) => `
        <div class="note" data-id=${note.id}>
        <div class="${note.title && "note-title"}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
        <div class="toolbar">
        <i class="far fa-trash-alt toolbar-delete" data-id=${note.id}></i>
        </div>
        </div>
        </div>
        `
            )
            .join("");
    }
}

new App();