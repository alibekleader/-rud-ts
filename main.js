var typePosition = document.querySelector(".type-position");
var typePositionModal = document.querySelector("#typePosition");
var positionModal = document.querySelector("#position");
var studentForm = document.querySelector(".student-form");
var studentModal = document.querySelector(".modal-student");
var studentTableBody = document.querySelector(".student-table tbody");
var modalOpenBtn = document.querySelector(".modal-open-btn");
var modalSubmitBtn = document.querySelector(".modal-submit-btn");
var studentSearchInput = document.querySelector(".student-search-input");
var typeMarried = document.querySelector(".type-married");
var sorted = document.querySelector(".type-sort");
var position = ["ReactJs", "NodeJs", "Python", "Go"];
var type = ["Junior", "Middle", "Senior"];
var marry = ["Yes", "No"];
var studentsJson = localStorage.getItem("students");
var students = JSON.parse(studentsJson || "[]");
var selected = null;
var search = "";
var positiontype = "Position";
var married = "isMarried";
var sort = "Sort";
// TYPE MARRIED
if (typeMarried) {
    typeMarried.innerHTML = "<option>isMarried</option>";
    marry.forEach(function (married) {
        if (typeMarried) {
            typeMarried.innerHTML += "<option>".concat(married, "</option>");
        }
    });
}
// TYPE POSITION
if (typePosition) {
    typePosition.innerHTML = "<option>Position</option>";
    typePositionModal.innerHTML = "<option>Select</option>";
    type.forEach(function (pos) {
        if (typePosition && typePositionModal) {
            typePosition.innerHTML += "<option>".concat(pos, "</option>");
            typePositionModal.innerHTML += "<option>".concat(pos, "</option>");
        }
    });
}
//  POSITION MODAL
if (positionModal) {
    positionModal.innerHTML = "<option>Select</option>";
    position.forEach(function (pos) {
        if (positionModal) {
            positionModal.innerHTML += "<option>".concat(pos, "</option>");
        }
    });
}
//  STUDENT FORM
if (studentForm) {
    studentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        this.classList.add("was-validated");
        if (this.checkValidity()) {
            var _a = this.elements, firstName = _a.firstName, lastName = _a.lastName, address = _a.address, birthDate = _a.birthDate, position_1 = _a.position, typePosition_1 = _a.typePosition, salary = _a.salary, isMarried = _a.isMarried;
            var student = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                birthDate: birthDate.value,
                position: position_1.value,
                typePosition: typePosition_1.value,
                salary: salary.value,
                isMarried: isMarried.checked,
            };
            if (selected === null) {
                students.push(student);
            }
            else {
                students[selected] = student;
            }
            console.log(student);
            localStorage.setItem("students", JSON.stringify(students));
            var studentModalInstance = new bootstrap.Modal(studentModal);
            studentModalInstance.hide();
            this.classList.remove("was-validated");
            getStudents();
        }
    });
}
// STUDENTS ROW
function getStudentRow(_a, i) {
    var firstName = _a.firstName, lastName = _a.lastName, address = _a.address, birthDate = _a.birthDate, position = _a.position, typePosition = _a.typePosition, salary = _a.salary, isMarried = _a.isMarried;
    return "\n   <tr>\n     <th scope=\"row\">".concat(i + 1, "</th>\n     <td>").concat(firstName, "</td>\n     <td>").concat(lastName, "</td>\n     <td>").concat(address, "</td>\n     <td>").concat(birthDate, "</td>\n     <td>").concat(position, "</td>\n     <td>").concat(typePosition, "</td>\n     <td>").concat(salary, " $</td>\n     <td>").concat(isMarried ? "Yes" : "No", "</td>\n     <td class=\"text-end\">\n       <button onclick=\"editStudent(").concat(i, ")\" data-bs-toggle=\"modal\"\n       data-bs-target=\"#exampleModal\" class=\"me-1 btn btn-primary\">Edit</button>\n       <button onclick=\"deleteStudent(").concat(i, ")\" class=\" btn btn-danger\">Delete</button>\n     </td>\n   </tr>                \n   ");
}
// GET STUDENT
function getStudents() {
    if (studentTableBody) {
        studentTableBody.innerHTML = "";
        var results = students.filter(function (student) {
            return student.firstName.toLowerCase().includes(search) ||
                student.lastName.toLowerCase().includes(search);
        });
        results.forEach(function (student, i) {
            if (studentTableBody) {
                studentTableBody.innerHTML += getStudentRow(student, i);
            }
        });
        if (positiontype !== "Position") {
            results = results.filter(function (student) { return student.typePosition === positiontype; });
        }
        if (married !== "isMarried") {
            results = results.filter(function (student) {
                return student.isMarried ? "Yes" : "No" === married;
            });
        }
        if (sort !== "Sort") {
            results.sort(function (a, b) {
                var nameA;
                var nameB;
                if (sort === "1") {
                    nameA = a.salary;
                    nameB = b.salary;
                }
                else {
                    nameB = a.salary;
                    nameA = b.salary;
                }
                if (nameA < nameB) {
                    return -1;
                }
                else if (nameA > nameB) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        if (results.length !== 0) {
            if (studentTableBody) {
                studentTableBody.innerHTML = "";
                results.forEach(function (student, i) {
                    if (studentTableBody) {
                        studentTableBody.innerHTML += getStudentRow(student, i);
                    }
                });
            }
        }
        else {
            if (studentTableBody) {
                studentTableBody.innerHTML = "<td colspan=\"10\">\n           <div class=\"alert alert-danger\">No students</div>\n         </td>";
            }
        }
    }
}
getStudents();
//  DELETE STUDENT
function deleteStudent(i) {
    var deleteConfirm = confirm("really delete it?");
    if (deleteConfirm) {
        students.splice(i, 1);
        localStorage.setItem("students", JSON.stringify(students));
        getStudents();
    }
}
//  EDIT STUDENT
function editStudent(i) {
    selected = i;
    modalSubmitBtn.textContent = "Save Student";
    var _a = students[i], firstName = _a.firstName, lastName = _a.lastName, address = _a.address, birthDate = _a.birthDate, position = _a.position, typePosition = _a.typePosition, salary = _a.salary, isMarried = _a.isMarried;
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
    modalOpenBtn.addEventListener("click", function () {
        selected = null;
        modalSubmitBtn.textContent = "Add student";
        var _a = studentForm.elements, firstName = _a.firstName, lastName = _a.lastName, address = _a.address, birthDate = _a.birthDate, position = _a.position, typePosition = _a.typePosition, salary = _a.salary, isMarried = _a.isMarried;
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
        search = event.target.value.trim().toLowerCase();
        getStudents();
    });
}
//  TYPE POSITION
if (typePosition) {
    typePosition.addEventListener("change", function (event) {
        positiontype = event.target.value;
        console.log(positiontype);
        getStudents();
    });
}
//  TYPE MARRIED
if (typeMarried) {
    typeMarried.addEventListener("change", function (event) {
        married = event.target.value;
        console.log(married);
        getStudents();
    });
}
//  SORT
if (sorted) {
    sorted.addEventListener("change", function (event) {
        sort = event.target.value;
        getStudents();
        console.log(sort);
    });
}
