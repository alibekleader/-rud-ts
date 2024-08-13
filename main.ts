const typePosition: Element | null = document.querySelector(".type-position");
const typePositionModal: HTMLElement | any = document.querySelector("#typePosition");
const positionModal: HTMLElement | null = document.querySelector("#position");
const studentForm: HTMLFormElement | null = document.querySelector(".student-form");
const studentModal: HTMLElement | null = document.querySelector(".modal-student");
const studentTableBody: HTMLTableSectionElement | null = document.querySelector(".student-table tbody");
const modalOpenBtn: HTMLButtonElement | null = document.querySelector(".modal-open-btn");
const modalSubmitBtn: HTMLButtonElement | any = document.querySelector(".modal-submit-btn");
const studentSearchInput: HTMLInputElement | null = document.querySelector(".student-search-input");
const typeMarried: HTMLInputElement | null = document.querySelector(".type-married");
const sorted: HTMLInputElement | null = document.querySelector(".type-sort");

const position: string[] = ["ReactJs", "NodeJs", "Python", "Go"];
const type: string[] = ["Junior", "Middle", "Senior"];
const marry: string[] = ["Yes", "No"];



let studentsJson: string | null = localStorage.getItem("students");
let students: any[] = JSON.parse(studentsJson || "[]");
let selected: any = null;
let search: string = "";
let positiontype: string = "Position";
let married: string = "isMarried";
let sort: string = "Sort";

// TYPE MARRIED

if (typeMarried) {
   typeMarried.innerHTML = "<option>isMarried</option>";
   marry.forEach(married => {
     if (typeMarried) {
       typeMarried.innerHTML += `<option>${married}</option>`;
     }
   });
 }

// TYPE POSITION
 
 if (typePosition) {
   typePosition.innerHTML = "<option>Position</option>";
   typePositionModal.innerHTML = "<option>Select</option>";
 
   type.forEach(pos => {
     if (typePosition && typePositionModal) {
       typePosition.innerHTML += `<option>${pos}</option>`;
       typePositionModal.innerHTML += `<option>${pos}</option>`;
     }
   });
 }

//  POSITION MODAL
 
 if (positionModal) {
   positionModal.innerHTML = "<option>Select</option>";
   position.forEach(pos => {
     if (positionModal) {
       positionModal.innerHTML += `<option>${pos}</option>`;
     }
   });
 }

//  STUDENT FORM


 if (studentForm) {
  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    this.classList.add("was-validated");
    if (this.checkValidity()) {
      
      let {
        firstName,
        lastName,
        address,
        birthDate,
        position,
        typePosition,
        salary,
        isMarried,
      } = this.elements;
      let student = {
        firstName: (firstName as HTMLInputElement).value,
        lastName: (lastName as HTMLInputElement).value,
        address: (address as HTMLInputElement).value,
        birthDate: (birthDate as HTMLInputElement).value,
        position: (position as HTMLInputElement).value,
        typePosition: (typePosition as HTMLInputElement).value,
        salary: (salary as HTMLInputElement).value,
        isMarried: (isMarried as HTMLInputElement).checked,
      };
      if (selected === null) {
        students.push(student);
      } else {
        students[selected] = student;
      }
      console.log(student);

      localStorage.setItem("students", JSON.stringify(students));
      const studentModalInstance = new bootstrap.Modal(studentModal);
      studentModalInstance.hide();

      this.classList.remove("was-validated");

      getStudents();
    }
  });
}

// STUDENTS ROW

function getStudentRow(
   {
     firstName,
     lastName,
     address,
     birthDate,
     position,
     typePosition,
     salary,
     isMarried,
   }: {
     firstName: string;
     lastName: string;
     address: string;
     birthDate: string;
     position: string;
     typePosition: string;
     salary: string;
     isMarried: boolean;
   },
   i: number
 ): string {
   return `
   <tr>
     <th scope="row">${i + 1}</th>
     <td>${firstName}</td>
     <td>${lastName}</td>
     <td>${address}</td>
     <td>${birthDate}</td>
     <td>${position}</td>
     <td>${typePosition}</td>
     <td>${salary} $</td>
     <td>${isMarried ? "Yes" : "No"}</td>
     <td class="text-end">
       <button onclick="editStudent(${i})" data-bs-toggle="modal"
       data-bs-target="#exampleModal" class="me-1 btn btn-primary">Edit</button>
       <button onclick="deleteStudent(${i})" class=" btn btn-danger">Delete</button>
     </td>
   </tr>                
   `;
}

// GET STUDENT

function getStudents(): void {
   if (studentTableBody) {
     studentTableBody.innerHTML = "";
 
     let results = students.filter(
       (student) =>
         student.firstName.toLowerCase().includes(search) ||
         student.lastName.toLowerCase().includes(search)
     );
 
     results.forEach((student, i) => {
       if (studentTableBody) {
         studentTableBody.innerHTML += getStudentRow(student, i);
       }
     });
 
     if (positiontype !== "Position") {
       results = results.filter(
         (student) => student.typePosition === positiontype
       );
     }
 
     if (married !== "isMarried") {
       results = results.filter((student) =>
         student.isMarried ? "Yes" : "No" === married
       );
     }
 
     if (sort !== "Sort") {
       results.sort((a, b) => {
         let nameA: string | number;
         let nameB: string | number;
         if (sort === "1") {
           nameA = a.salary;
           nameB = b.salary;
         } else {
           nameB = a.salary;
           nameA = b.salary;
         }
 
         if (nameA < nameB) {
           return -1;
         } else if (nameA > nameB) {
           return 1;
         } else {
           return 0;
         }
       });
     }
 
     if (results.length !== 0) {
       if (studentTableBody) {
         studentTableBody.innerHTML = "";
         results.forEach((student, i) => {
           if (studentTableBody) {
             studentTableBody.innerHTML += getStudentRow(student, i);
           }
         });
       }
     } else {
       if (studentTableBody) {
         studentTableBody.innerHTML = `<td colspan="10">
           <div class="alert alert-danger">No students</div>
         </td>`;
       }
     }
   }
 }
 
 getStudents();


//  DELETE STUDENT

 function deleteStudent(i: number): void {
   let deleteConfirm = confirm("really delete it?");
   if (deleteConfirm) {
     students.splice(i, 1);
     localStorage.setItem("students", JSON.stringify(students));
     getStudents();
   }
 }

//  EDIT STUDENT

 function editStudent(i: number): void {
   selected = i;
   modalSubmitBtn.textContent = "Save Student";
 
   let {
     firstName,
     lastName,
     address,
     birthDate,
     position,
     typePosition,
     salary,
     isMarried,
   } = students[i];
 
   if (studentForm) {
     studentForm.firstName.value = firstName;
     studentForm.lastName.value = lastName;
     studentForm.address.value = address;
     studentForm.birthDate.value = birthDate;
     studentForm.position.value = position;
     studentForm.typePosition.value = typePosition;
     studentForm.salary.value = salary;
     studentForm.isMarried.checked = isMarried;
   }
 }


// MODAL OPEN STUDENT FORM
 
 if (modalOpenBtn && studentForm) {
   modalOpenBtn.addEventListener("click", () => {
     selected = null;
     modalSubmitBtn.textContent = "Add student";
     let {
       firstName,
       lastName,
       address,
       birthDate,
       position,
       typePosition,
       salary,
       isMarried,
     } = studentForm.elements as {
       firstName: HTMLInputElement;
       lastName: HTMLInputElement;
       address: HTMLInputElement;
       birthDate: HTMLInputElement;
       position: HTMLSelectElement;
       typePosition: HTMLSelectElement;
       salary: HTMLInputElement;
       isMarried: HTMLInputElement;
     };
     firstName.value = "";
     lastName.value = "";
     address.value = "";
     birthDate.value = "";
     position.value = position.options[0].value;
     typePosition.value = typePosition.options[0].value;
     salary.value = "";
     isMarried.checked = false;
   });
 }

//  SEARCH

 if (studentSearchInput) {
   studentSearchInput.addEventListener("keyup", function (event) {
     search = (event.target as HTMLInputElement).value.trim().toLowerCase();
     getStudents();
   });
 }

//  TYPE POSITION
 if (typePosition) {
   typePosition.addEventListener("change", function (event) {
     positiontype = (event.target as HTMLSelectElement).value;
     console.log(positiontype);
     getStudents();
   });
 }

//  TYPE MARRIED

 if (typeMarried) {
   typeMarried.addEventListener("change", function (event) {
     married = (event.target as HTMLSelectElement).value;
     console.log(married);
     getStudents();
   });
 }

//  SORT

 if (sorted) {
   sorted.addEventListener("change", function (event) {
     sort = (event.target as HTMLSelectElement).value;
     getStudents();
     console.log(sort);
   });
 }
     

 
