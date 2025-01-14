//!aylar
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! html'den gelen elemanlar
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

// ! localstorage'dan notelar alınd ve not yoksa boş dizi döndü
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// ! Güncelleme değişkenleri
let isUpdate = false;
let updateId = null;

// ! Fonksiyonlar ve olay izleyicileri

addBox.addEventListener("click", () => {
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  document.querySelector("body").style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  document.querySelector("body").style.overflow = "auto";
});

function showMenu(elem) {
  elem.parentElement.classList.add("show");

  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

//!silme işlemi
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediğinize eminmisiniz ?");
    if (res) {
      const note = e.target.closest(".note");

      const noteId = note.dataset.id;

      notes = notes.filter((note) => note.id != noteId);

      localStorage.setItem("notes", JSON.stringify(notes));

      renderNotes();
    }
  } else if (e.target.classList.contains("updateIcon")) {
    const note = e.target.closest(".note");

    const noteId = parseInt(note.dataset.id);

    const foundedNote = notes.find((note) => note.id == noteId);

    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    isUpdate = true;
    updateId = noteId;

    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

//!form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let titleInput = e.target[0];
  let descriptionInput = e.target[1];

  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  if (!title && !description) {
    alert("Lütfen formdaki gerekli kısımları doldurunuz !");
  }

  const date = new Date();
  let id = new Date().getTime();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = months[date.getMonth()];

  if (isUpdate) {
    const noteIndex = notes.findIndex((note) => {
      return note.id == updateId;
    });

    notes[noteIndex] = {
      title,
      description,
      id,
      date: `${month} ${day},${year}`,
    };

    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    let noteInfo = {
      title,
      description,
      date: `${month} ${day},${year}`,
      id,
    };

    notes.push(noteInfo);
  }

  localStorage.setItem("notes", JSON.stringify(notes));

  titleInput.value = "";
  descriptionInput.value = "";

  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");

  document.querySelector("body").style.overflow = "auto";

  renderNotes();
});

// ! Localstorage'daki verileri renderla

function renderNotes() {
  if (!notes) return;

  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((note) => {
    let liTag = `<li class="note" data-id='${note.id}'>
        <div class="details">
          <p class="title">${note.title}</p>
          <p class="description">
         ${note.description}
          </p>
        </div>
     
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings ">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class='updateIcon'><i class="bx bx-edit"></i> Düzenle</li>
              <li class='deleteIcon'><i class="bx bx-trash"></i> Sil</li>
            </ul>
          </div>
        </div>
      </li>`;

    addBox.insertAdjacentHTML("afterend", liTag);
  });
}

document.addEventListener("DOMContentLoaded", () => renderNotes());
