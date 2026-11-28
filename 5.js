
function login()
{
    var id = document.getElementById("ID").value.trim();
    var password = document.getElementById("password").value;
    var occupation = document.getElementById("occupation").value.toLowerCase().trim();

    if (!id || !password || !occupation)
    {
        alert("Fill Credentials");
        return;
    }

    // STUDENT LOGIN
    if (occupation == "student")
    {
        var data = hostelGetData();

        var allocated = false;

        // Check whether student has a room allocation
        for (var i = 0; i < data.allocations.length; i++)
        {
            if (String(data.allocations[i].rollNo).toLowerCase() == id.toLowerCase())
            {
                allocated = true;
                break;
            }
        }

        if (!allocated)
        {
            alert("Not Allocated! You cannot login because management has not allocated you a room.");
            return;
        }

        // Get student credentials
        var credentials = JSON.parse(
            localStorage.getItem("studentCredentials")
        ) || {};

        var student = credentials[id.toLowerCase()];

        if (!student)
        {
            alert("Password not assigned. Please contact management.");
            return;
        }

        // Verify password
        if (student.password !== password)
        {
            alert("Wrong Password!");
            return;
        }

        // Successful login
        localStorage.setItem("loggedInStudent", id);

        window.location.href = "Dashboard Student.html";
    }

    // MANAGEMENT LOGIN
    else if (occupation == "management")
    {
        window.location.href = "Dashboard Management.html";
    }
}

function displayStudentProfile()
{
    var rollNo = localStorage.getItem("loggedInStudent");

    if (rollNo == null)
    {
        alert("Please login first.");
        return;
    }

    // Get student allocation data
    var data = hostelGetData();

    var studentName = "";
    var batch = "";
    var room = "";
    var bed = "";

    // Find logged-in student
    for (var i = 0; i < data.allocations.length; i++)
    {
        var a = data.allocations[i];

        if (String(a.rollNo).toLowerCase() == rollNo.toLowerCase())
        {
            studentName = a.name;
            batch = a.batch;
            room = a.room;
            bed = a.bed;

            break;
        }
    }

    // Count complaints and room change requests
    var count = getStudentRequestCount(rollNo);

    // Display information
    document.getElementById("name").value =
        studentName || "Not Available";

    document.getElementById("rollNo").value = rollNo;

    document.getElementById("roomNo").value =
        room || "Not Allocated";

    document.getElementById("bedNo").value =
        bed || "Not Allocated";

    document.getElementById("batch").value =
        batch || "Not Available";

    document.getElementById("requests").value = count;
}

function getStudentRequestCount(rollNo)
{
    var complaints = getComplaints();
    var roomRequests = getRoomChangeRequests();
    var count = 0;

    for (var i = 0; i < complaints.length; i++)
    {
        if (String(complaints[i].rollNo).toLowerCase() == String(rollNo).toLowerCase())
        {
            count++;
        }
    }

    for (var i = 0; i < roomRequests.length; i++)
    {
        if (String(roomRequests[i].rollNo).toLowerCase() == String(rollNo).toLowerCase())
        {
            count++;
        }
    }

    return count;
}
function checkComplaintStatus()
{
    var rollNo = localStorage.getItem("loggedInStudent");
    var container = document.getElementById("statusContainer");

    container.innerHTML = "";

    if (rollNo == null)
    {
        container.innerHTML = "Please login first.";
        return;
    }

    var complaints = getComplaints();
    var found = false;

    for (var i = 0; i < complaints.length; i++)
    {
        var c = complaints[i];

        if (String(c.rollNo).toLowerCase() == String(rollNo).toLowerCase())
        {
            found = true;

            container.innerHTML += `
                <div class="complaintCard">

                    <h3>Complaint Status</h3>

                    <p>Complaint ID: ${c.id}</p>
                    <p>Student Name: ${c.studentName}</p>
                    <p>Complaint: ${c.complaint}</p>
                    <p>Status: ${c.status}</p>
                    <p>Management Remarks: ${c.remarks}</p>
                    <p>Date: ${c.date}</p>

                    <hr>

                </div>
            `;
        }
    }

    if (found == false)
    {
        container.innerHTML = "You have not submitted any complaints.";
    }
}

function checkRoomChangeStatus()
{
    var rollNo = localStorage.getItem("loggedInStudent");
    var container = document.getElementById("statusContainer");

    container.innerHTML = "";

    if (rollNo == null)
    {
        container.innerHTML = "Please login first.";
        return;
    }

    var requests = getRoomChangeRequests();
    var found = false;

    for (var i = 0; i < requests.length; i++)
    {
        var r = requests[i];

        if (String(r.rollNo).toLowerCase() == String(rollNo).toLowerCase())
        {
            found = true;

            container.innerHTML += `
                <div class="complaintCard">

                    <h3>Room Change Request Status</h3>

                    <p>Request ID: ${r.id}</p>
                    <p>Student Name: ${r.studentName}</p>
                    <p>Current Room: ${r.currentRoom}</p>
                    <p>Desired Room: ${r.desiredRoom}</p>
                    <p>Reason: ${r.reason}</p>
                    <p>Status: ${r.status}</p>
                    <p>Management Remarks: ${r.remarks}</p>
                    <p>Date: ${r.date}</p>

                    <hr>

                </div>
            `;
        }
    }

    if (found == false)
    {
        container.innerHTML = "You have not submitted any room change requests.";
    }
}

function roomAv()
{
window.location.href = 'Room Availability.html';
}
function roomAl()
{
window.location.href = 'Room Allocation.html';
}

function requestProcessing()
{
window.location.href = 'Request Processing.html';
}
function complainSubmission()
{
window.location.href = 'Complain Submission.html';
}
function complainManagement()
{
window.location.href = 'Complain Management.html';
}
function roomChangemt()
{
window.location.href = 'Room Change mt.html';
}
function roomChangest()
{
window.location.href = 'Room Change.html';
}
function reportGeneration()
{
window.location.href = 'Report Generation.html';
}

function profilemt()
{
window.location.href = 'View Profile mt.html';
}
function profilest()
{
window.location.href = 'View Profile st.html';
}
function submitComplaint()
{
    var studentName = document.getElementById("name").value.trim();
    var rollNo = document.getElementById("rollNo").value.trim();
    var complaintText = document.getElementById("complaintText").value.trim();
    var batch = document.getElementById("batch").value.trim();

    if (studentName == "" || rollNo == "" || complaintText == "")
    {
        alert("Please fill all required fields");
        return;
    }

    var complaint = {
        id: Date.now(),
        studentName: studentName,
        rollNo: rollNo,
        batch: batch,
        complaint: complaintText,
        status: "Pending",
        remarks: "No remarks yet",
        date: new Date().toLocaleDateString()
    };

    addComplaint(complaint);

    document.getElementById("message").innerHTML =
        "Complaint submitted successfully!";

    document.getElementById("complaintForm").reset();
}
function manageUpdate(id)
{
    var status = document.getElementById("status" + id).value;

    var remarks = document.getElementById("remarks" + id).value;

    updateComplaint(id, status, remarks);

    alert("Complaint Updated Successfully!");

    displayComplaints();
}

function displayComplaints()
{
    var complaints = getComplaints();

    var container = document.getElementById("complaintsContainer");

    container.innerHTML = "";

    if (complaints.length == 0)
    {
        container.innerHTML = "No complaints submitted yet.";
        return;
    }

    for (var i = 0; i < complaints.length; i++)
    {
        var c = complaints[i];

        container.innerHTML += `
            <div class="complaintCard">

                <h3>Complaint ID: ${c.id}</h3>

                <p>Student Name: ${c.studentName}</p>
                <p>Roll No: ${c.rollNo}</p>
                <p>Batch: ${c.batch}</p>
                <p>Complaint: ${c.complaint}</p>
                <p>Current Status: ${c.status}</p>
                <p>Current Remarks: ${c.remarks}</p>
                <p>Date: ${c.date}</p>

                <label>Update Status:</label>

                <select id="status${c.id}">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <br><br>

                <label>Management Remarks:</label>

                <input type="text"
                       id="remarks${c.id}"
                       placeholder="Enter remarks">

                <br><br>

                <button onclick="manageUpdate(${c.id})">
                    Update Complaint
                </button>

                <button onclick="deleteManagementComplaint(${c.id})">
                    Delete Complaint
                </button>

                <hr>

            </div>
        `;
    }
}

function displayResolvedComplaints()
{
    var complaints = getComplaints();

    var container = document.getElementById("complaintsContainer");

    container.innerHTML = "";

    var found = false;

    for (var i = 0; i < complaints.length; i++)
    {
        var c = complaints[i];

        if (c.status == "Resolved")
        {
            found = true;

            container.innerHTML += `
                <div class="complaintCard">

                    <h3>Complaint ID: ${c.id}</h3>

                    <p>Student Name: ${c.studentName}</p>
                    <p>Roll No: ${c.rollNo}</p>
                    <p>Batch: ${c.batch}</p>
                    <p>Complaint: ${c.complaint}</p>
                    <p>Status: ${c.status}</p>
                    <p>Management Remarks: ${c.remarks}</p>
                    <p>Date: ${c.date}</p>

                    <hr>

                </div>
            `;
        }
    }

    if (found == false)
    {
        container.innerHTML = "No resolved complaints found.";
    }
}

function deleteManagementComplaint(id)
{
    var confirmDelete = confirm("Are you sure you want to delete this complaint?");

    if (confirmDelete)
    {
        deleteComplaint(id);

        alert("Complaint Deleted Successfully!");

        displayComplaints();
    }
}
// Submit Room Change Request

function submitRoomChange()
{
    var studentName = document.getElementById("studentName").value.trim();
    var rollNo = document.getElementById("rollNo").value.trim();

    var currentHall = Number(document.getElementById("currentHall").value);
    var currentRoom = Number(document.getElementById("currentRoom").value);

    var desiredHall = Number(document.getElementById("desiredHall").value);
    var desiredRoom = Number(document.getElementById("desiredRoom").value);

    var reason = document.getElementById("reason").value.trim();

    // Check all fields
    if (!studentName || !rollNo ||
        !currentHall || !currentRoom ||
        !desiredHall || !desiredRoom || !reason)
    {
        alert("Please fill all fields.");
        return;
    }

    // Validate hall and room numbers
    if (currentHall < 1 || currentHall > 2 ||
        desiredHall < 1 || desiredHall > 2 ||
        currentRoom < 1 || currentRoom > 50 ||
        desiredRoom < 1 || desiredRoom > 50)
    {
        alert("Enter valid hall numbers (1-2) and room numbers (1-50).");
        return;
    }

    // Prevent requesting the same hall and room
    if (currentHall == desiredHall && currentRoom == desiredRoom)
    {
        alert("Desired hall and room must be different from current allocation.");
        return;
    }

    // Verify the student's current allocation
    var data = hostelGetData();
    var allocationFound = false;

    for (var i = 0; i < data.allocations.length; i++)
    {
        var a = data.allocations[i];

        if (String(a.rollNo).toLowerCase() == rollNo.toLowerCase() &&
            Number(a.hall) == currentHall &&
            Number(a.room) == currentRoom)
        {
            allocationFound = true;
            break;
        }
    }

    if (allocationFound == false)
    {
        alert("Student roll number, current hall, or current room does not match the allocation records.");
        return;
    }

    // Get existing requests
    var requests = getRoomChangeRequests();

    // Prevent multiple pending requests
    for (var i = 0; i < requests.length; i++)
    {
        if (String(requests[i].rollNo).toLowerCase() == rollNo.toLowerCase() &&
            requests[i].status == "Pending")
        {
            alert("You already have a pending room change request.");
            return;
        }
    }

    // Create request
    var request = {
        id: Date.now(),
        studentName: studentName,
        rollNo: rollNo,

        currentHall: currentHall,
        currentRoom: currentRoom,

        desiredHall: desiredHall,
        desiredRoom: desiredRoom,

        reason: reason,
        status: "Pending",
        remarks: "No remarks yet",
        date: new Date().toLocaleDateString()
    };

    requests.push(request);

    saveRoomChangeRequests(requests);

    document.getElementById("message").innerHTML =
        "Room change request submitted successfully!";

    alert("Room Change Request Submitted Successfully!");

    document.getElementById("roomChangeForm").reset();
}


// Get all room change requests
function getRoomChangeRequests()
{
    return JSON.parse(localStorage.getItem("roomChangeRequests")) || [];
}


// Save room change requests
function saveRoomChangeRequests(requests)
{
    localStorage.setItem("roomChangeRequests", JSON.stringify(requests));
}
// Display all room change requests
function displayRoomChangeRequests()
{
    var requests = getRoomChangeRequests();

    var container = document.getElementById("complaintsContainer");

    container.innerHTML = "";

    if (requests.length == 0)
    {
        container.innerHTML = "No room change requests submitted yet.";
        return;
    }

    for (var i = 0; i < requests.length; i++)
    {
        var r = requests[i];

        container.innerHTML += `
            <div class="complaintCard">

                <h3>Request ID: ${r.id}</h3>

                <p>Student Name: ${r.studentName}</p>
                <p>Roll No: ${r.rollNo}</p>
                <p>Current Room: ${r.currentRoom}</p>
                <p>Desired Room: ${r.desiredRoom}</p>
                <p>Reason: ${r.reason}</p>
                <p>Status: ${r.status}</p>
                <p>Management Remarks: ${r.remarks}</p>
                <p>Date: ${r.date}</p>

                <label>Update Status:</label>

                <select id="roomStatus${r.id}">
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <br><br>

                <label>Management Remarks:</label>

                <input type="text"
                       id="roomRemarks${r.id}"
                       placeholder="Enter remarks">

                <br><br>

                <button onclick="updateRoomChangeRequest(${r.id})">
                    Update Request
                </button>

                <hr>

            </div>
        `;
    }
}


// Update room change request

function updateRoomChangeRequest(id)
{
    var status = document.getElementById("roomStatus" + id).value;

    var remarks = document.getElementById("roomRemarks" + id).value.trim();

    var requests = getRoomChangeRequests();
    var request = null;

    // Find request
    for (var i = 0; i < requests.length; i++)
    {
        if (requests[i].id == id)
        {
            request = requests[i];
            break;
        }
    }

    if (request == null)
    {
        alert("Request not found.");
        return;
    }

    if (request.status == "Approved")
    {
        alert("This request has already been approved.");
        return;
    }

    if (status == "Approved")
    {
        var data = hostelGetData();
        var allocation = null;

        // Find student's actual allocation
        for (var i = 0; i < data.allocations.length; i++)
        {
            var a = data.allocations[i];

            if (String(a.rollNo).toLowerCase() ==
                String(request.rollNo).toLowerCase())
            {
                allocation = a;
                break;
            }
        }

        if (allocation == null)
        {
            alert("Student allocation not found.");
            return;
        }

        // Verify that the student's current allocation matches the request
        if (Number(allocation.hall) != Number(request.currentHall) ||
            Number(allocation.room) != Number(request.currentRoom))
        {
            alert("Student's current allocation does not match this request.");
            return;
        }

        var hall = Number(request.desiredHall);
        var room = Number(request.desiredRoom);

        if (hall < 1 || hall > 2 || room < 1 || room > 50)
        {
            alert("Invalid desired hall or room.");
            return;
        }

        // Find first available bed
        var availableBed = 0;

        for (var bed = 1; bed <= data.bedsPerRoom; bed++)
        {
            var occupied = false;

            for (var j = 0; j < data.allocations.length; j++)
            {
                var a = data.allocations[j];

                if (a !== allocation &&
                    Number(a.hall) == hall &&
                    Number(a.room) == room &&
                    Number(a.bed) == bed)
                {
                    occupied = true;
                    break;
                }
            }

            if (occupied == false)
            {
                availableBed = bed;
                break;
            }
        }

        if (availableBed == 0)
        {
            alert("The requested room is full. Student allocation has not been changed.");
            return;
        }

        // Update student's actual allocation
        allocation.hall = hall;
        allocation.floor = Math.ceil(room / 10);
        allocation.room = room;
        allocation.bed = availableBed;

        hostelSaveData(data);
    }

    // Update request status
    request.status = status;
    request.remarks = remarks || "No remarks";

    saveRoomChangeRequests(requests);

    alert("Room Change Request Updated Successfully!");

    displayRoomChangeRequests();
}


// Display only approved room change requests
function displayApprovedRoomChanges()
{
    var requests = getRoomChangeRequests();

    var container = document.getElementById("complaintsContainer");

    container.innerHTML = "";

    var found = false;

    for (var i = 0; i < requests.length; i++)
    {
        var r = requests[i];

        if (r.status == "Approved")
        {
            found = true;

            container.innerHTML += `
                <div class="complaintCard">

                    <h3>Request ID: ${r.id}</h3>

                    <p>Student Name: ${r.studentName}</p>
                    <p>Roll No: ${r.rollNo}</p>
                    <p>Current Room: ${r.currentRoom}</p>
                    <p>Desired Room: ${r.desiredRoom}</p>
                    <p>Reason: ${r.reason}</p>
                    <p>Status: ${r.status}</p>
                    <p>Management Remarks: ${r.remarks}</p>
                    <p>Date: ${r.date}</p>

                    <hr>

                </div>
            `;
        }
    }

    if (found == false)
    {
        container.innerHTML = "No approved room change requests found.";
    }
}


// =====================================
// HOSTEL ROOM ALLOCATION SYSTEM
// =====================================


//////////////////////////////////////////////////
// HOSTEL ROOM AND BED INVENTORY
//////////////////////////////////////////////////

// Initialize hostel data
function hostelInitialize()
{
    var savedData = localStorage.getItem("hostelData");

    if (savedData == null)
    {
        var data = {
            totalHalls: 2,
            floorsPerHall: 5,
            roomsPerFloor: 10,
            bedsPerRoom: 6,
            allocations: []
        };

        localStorage.setItem("hostelData", JSON.stringify(data));
    }
    else
    {
        var oldData = JSON.parse(savedData);

        // Handle the older inventory structure safely
        if (oldData.totalHalls == undefined)
        {
            // Preserve the old data instead of silently deleting it
            if (localStorage.getItem("hostelData_backup") == null)
            {
                localStorage.setItem("hostelData_backup", savedData);
            }

            var newData = {
                totalHalls: 2,
                floorsPerHall: 5,
                roomsPerFloor: 10,
                bedsPerRoom: 6,
                allocations: []
            };

            localStorage.setItem("hostelData", JSON.stringify(newData));
        }
    }
}


// Get hostel data
function hostelGetData()
{
    hostelInitialize();

    return JSON.parse(localStorage.getItem("hostelData"));
}


// Save hostel data
function hostelSaveData(data)
{
    localStorage.setItem("hostelData", JSON.stringify(data));
}


// Load rooms according to selected hall and floor
function hostelLoadRooms()
{
    var hall = document.getElementById("hallNo").value;
    var floor = document.getElementById("floorNo").value;

    var roomSelect = document.getElementById("roomNo");
    var bedSelect = document.getElementById("bedNo");

    roomSelect.innerHTML = '<option value="">Select Room</option>';
    bedSelect.innerHTML = '<option value="">Select Bed</option>';

    if (hall == "" || floor == "")
    {
        return;
    }

    var firstRoom = (Number(floor) - 1) * 10 + 1;
    var lastRoom = firstRoom + 9;

    for (var i = firstRoom; i <= lastRoom; i++)
    {
        var option = document.createElement("option");

        option.value = i;
        option.textContent = "Room " + i;

        roomSelect.appendChild(option);
    }
}


// Load only available beds
function hostelLoadBeds()
{
    var hall = Number(document.getElementById("hallNo").value);
    var room = Number(document.getElementById("roomNo").value);

    var bedSelect = document.getElementById("bedNo");

    bedSelect.innerHTML = '<option value="">Select Bed</option>';

    if (hall == 0 || room == 0)
    {
        return;
    }

    var data = hostelGetData();

    for (var bed = 1; bed <= data.bedsPerRoom; bed++)
    {
        var occupied = false;

        for (var i = 0; i < data.allocations.length; i++)
        {
            var allocation = data.allocations[i];

            if (Number(allocation.hall) == hall &&
                Number(allocation.room) == room &&
                Number(allocation.bed) == bed)
            {
                occupied = true;
                break;
            }
        }

        if (occupied == false)
        {
            var option = document.createElement("option");

            option.value = bed;
            option.textContent = "Bed " + bed;

            bedSelect.appendChild(option);
        }
    }
}

// Allocate bed to student
function hostelAllocateBed(event)
{
    event.preventDefault();

    var name = document.getElementById("studentName").value.trim();
    var rollNo = document.getElementById("rollNo").value.trim();
    var batch = document.getElementById("batch").value.trim();

    var initialPassword = document.getElementById("initialPassword").value;

    var hall = Number(document.getElementById("hallNo").value);
    var floor = Number(document.getElementById("floorNo").value);
    var room = Number(document.getElementById("roomNo").value);
    var bed = Number(document.getElementById("bedNo").value);

    if (!name || !rollNo || !batch || !initialPassword ||
        !hall || !floor || !room || !bed)
    {
        alert("Please fill all fields, including initial password.");
        return;
    }

    if (initialPassword.length < 6)
    {
        alert("Initial password must contain at least 6 characters.");
        return;
    }

    if (hall < 1 || hall > 2 ||
        floor < 1 || floor > 5 ||
        room < 1 || room > 50 ||
        bed < 1 || bed > 6)
    {
        alert("Invalid hall, floor, room, or bed.");
        return;
    }

    var correctFloor = Math.ceil(room / 10);

    if (correctFloor != floor)
    {
        alert("Selected room does not belong to this floor.");
        return;
    }

    var data = hostelGetData();

    for (var i = 0; i < data.allocations.length; i++)
    {
        if (String(data.allocations[i].rollNo).toLowerCase() == rollNo.toLowerCase())
        {
            alert("This student already has a bed allocated.");
            return;
        }
    }

    for (var i = 0; i < data.allocations.length; i++)
    {
        var a = data.allocations[i];

        if (Number(a.hall) == hall &&
            Number(a.room) == room &&
            Number(a.bed) == bed)
        {
            alert("This bed is already occupied.");
            hostelLoadBeds();
            return;
        }
    }

    // Save room allocation
    var allocation = {
        name: name,
        rollNo: rollNo,
        batch: batch,
        hall: hall,
        floor: floor,
        room: room,
        bed: bed
    };

    data.allocations.push(allocation);

    hostelSaveData(data);

    // Save student's initial login password
    var credentials = JSON.parse(
        localStorage.getItem("studentCredentials")
    ) || {};

    credentials[rollNo.toLowerCase()] = {
        password: initialPassword
    };

    localStorage.setItem(
        "studentCredentials",
        JSON.stringify(credentials)
    );

    alert("Room allocated and student login credentials created successfully!");

    document.querySelector("form").reset();

    document.getElementById("roomNo").innerHTML =
        '<option value="">Select Room</option>';

    document.getElementById("bedNo").innerHTML =
        '<option value="">Select Bed</option>';
}

// Calculate hostel availability
function hostelGetStats()
{
    var data = hostelGetData();

    var totalRooms = data.totalHalls *
                     data.floorsPerHall *
                     data.roomsPerFloor;

    var totalBeds = totalRooms * data.bedsPerRoom;

    var occupiedBeds = data.allocations.length;

    var roomCounts = {};

    // Count allocated beds separately for each hall and room
    for (var i = 0; i < data.allocations.length; i++)
    {
        var a = data.allocations[i];

        var key = a.hall + "-" + a.room;

        if (roomCounts[key] == undefined)
        {
            roomCounts[key] = 0;
        }

        roomCounts[key]++;
    }

    var occupiedRooms = 0;

    // A room is occupied only when all six beds are allocated
    for (var key in roomCounts)
    {
        if (roomCounts[key] == data.bedsPerRoom)
        {
            occupiedRooms++;
        }
    }

    return {
        totalRooms: totalRooms,
        totalBeds: totalBeds,
        occupiedRooms: occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupiedBeds: occupiedBeds,
        availableBeds: totalBeds - occupiedBeds
    };
}


// Display room availability
function displayRoomAvailability()
{
    var stats = hostelGetStats();

    document.getElementById("roomsAvailable").value =
        stats.availableRooms;

    document.getElementById("bedsAvailable").value =
        stats.availableBeds;

    document.getElementById("roomsOccupied").value =
        stats.occupiedRooms;

    document.getElementById("bedsOccupied").value =
        stats.occupiedBeds;

    document.getElementById("totalRooms").value =
        stats.totalRooms;

    document.getElementById("totalBeds").value =
        stats.totalBeds;
}


// Remove a student's allocation
function removeBedAllocation(rollNo)
{
    var data = hostelGetData();

    var oldLength = data.allocations.length;

    data.allocations = data.allocations.filter(function(a)
    {
        return String(a.rollNo).toLowerCase() !=
               String(rollNo).toLowerCase();
    });

    if (data.allocations.length != oldLength)
    {
        hostelSaveData(data);

        var credentials = JSON.parse(
            localStorage.getItem("studentCredentials")
        ) || {};

        delete credentials[rollNo.toLowerCase()];

        localStorage.setItem(
            "studentCredentials",
            JSON.stringify(credentials)
        );

        // End the session if the removed student is logged in
        if (String(localStorage.getItem("loggedInStudent")).toLowerCase()
            == String(rollNo).toLowerCase())
        {
            localStorage.removeItem("loggedInStudent");
        }

        alert("Bed allocation and student login access removed successfully!");
    }
    else
    {
        alert("No allocation found for this student.");
    }
}


// Initialize inventory
hostelInitialize();


// =====================================
// REPORT GENERATION
// =====================================

function escapeReportHTML(value)
{
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


function generateHostelReport()
{
    // Get existing hostel data
    var data = hostelGetData();

    var allocations = data.allocations || [];
    var complaints = getComplaints();
    var requests = getRoomChangeRequests();

    // Calculate inventory
    var totalRooms = data.totalHalls *
                     data.floorsPerHall *
                     data.roomsPerFloor;

    var totalBeds = totalRooms * data.bedsPerRoom;

    var occupiedBeds = allocations.length;
    var availableBeds = totalBeds - occupiedBeds;

    // Count occupied rooms (a room is occupied if at least 1 bed is allocated)
    var roomCount = {};

    for (var i = 0; i < allocations.length; i++)
    {
        var a = allocations[i];

        var key = a.hall + "-" + a.room;

        if (roomCount[key] == undefined)
        {
            roomCount[key] = 0;
        }

        roomCount[key]++;
    }

    var occupiedRooms = Object.keys(roomCount).length;
    var availableRooms = totalRooms - occupiedRooms;

    // Complaint statistics
    var pendingComplaints = 0;
    var inProgressComplaints = 0;
    var resolvedComplaints = 0;
    var rejectedComplaints = 0;

    for (var i = 0; i < complaints.length; i++)
    {
        var status = complaints[i].status;

        if (status == "Pending")
        {
            pendingComplaints++;
        }
        else if (status == "In Progress")
        {
            inProgressComplaints++;
        }
        else if (status == "Resolved")
        {
            resolvedComplaints++;
        }
        else if (status == "Rejected")
        {
            rejectedComplaints++;
        }
    }

    // Room change request statistics
    var pendingRoomRequests = 0;
    var approvedRoomRequests = 0;
    var rejectedRoomRequests = 0;

    for (var i = 0; i < requests.length; i++)
    {
        var status = requests[i].status;

        if (status == "Pending")
        {
            pendingRoomRequests++;
        }
        else if (status == "Approved")
        {
            approvedRoomRequests++;
        }
        else if (status == "Rejected")
        {
            rejectedRoomRequests++;
        }
    }

    // Calculate occupancy percentage
    var occupancyPercentage = 0;

    if (totalBeds > 0)
    {
        occupancyPercentage = ((occupiedBeds / totalBeds) * 100).toFixed(2);
    }

    // Generate allocation table
    var allocationTable = "";

    if (allocations.length == 0)
    {
        allocationTable = `
            <tr>
                <td colspan="7">No students allocated yet.</td>
            </tr>
        `;
    }
    else
    {
        for (var i = 0; i < allocations.length; i++)
        {
            var a = allocations[i];

            allocationTable += `
                <tr>
                    <td>${escapeReportHTML(a.name)}</td>
                    <td>${escapeReportHTML(a.rollNo)}</td>
                    <td>${escapeReportHTML(a.batch)}</td>
                    <td>${escapeReportHTML(a.hall)}</td>
                    <td>${escapeReportHTML(a.floor || Math.ceil(a.room / 10))}</td>
                    <td>${escapeReportHTML(a.room)}</td>
                    <td>${escapeReportHTML(a.bed)}</td>
                </tr>
            `;
        }
    }

    // Generate complaint table
    var complaintTable = "";

    if (complaints.length == 0)
    {
        complaintTable = `
            <tr>
                <td colspan="6">No complaints submitted.</td>
            </tr>
        `;
    }
    else
    {
        for (var i = 0; i < complaints.length; i++)
        {
            var c = complaints[i];

            complaintTable += `
                <tr>
                    <td>${escapeReportHTML(c.id)}</td>
                    <td>${escapeReportHTML(c.studentName)}</td>
                    <td>${escapeReportHTML(c.rollNo)}</td>
                    <td>${escapeReportHTML(c.complaint)}</td>
                    <td>${escapeReportHTML(c.status)}</td>
                    <td>${escapeReportHTML(c.remarks)}</td>
                </tr>
            `;
        }
    }

    // Generate room change request table
    var roomRequestTable = "";

    if (requests.length == 0)
    {
        roomRequestTable = `
            <tr>
                <td colspan="7">No room change requests submitted.</td>
            </tr>
        `;
    }
    else
    {
        for (var i = 0; i < requests.length; i++)
        {
            var r = requests[i];

            roomRequestTable += `
                <tr>
                    <td>${escapeReportHTML(r.id)}</td>
                    <td>${escapeReportHTML(r.studentName)}</td>
                    <td>${escapeReportHTML(r.rollNo)}</td>
                    <td>${escapeReportHTML(r.currentHall)} - ${escapeReportHTML(r.currentRoom)}</td>
                    <td>${escapeReportHTML(r.desiredHall)} - ${escapeReportHTML(r.desiredRoom)}</td>
                    <td>${escapeReportHTML(r.status)}</td>
                    <td>${escapeReportHTML(r.remarks)}</td>
                </tr>
            `;
        }
    }

    // Display generated report
    var container = document.getElementById("reportContainer");

    container.innerHTML = `
        <div id="hostelReport"
             style="background:white;color:black;padding:20px;margin:20px auto;
                    max-width:1100px;border:1px solid black;">

            <h1 style="text-align:center;">HOSTEL MANAGEMENT REPORT</h1>

            <h3 style="text-align:center;">
                Generated on: ${new Date().toLocaleString()}
            </h3>

            <hr>

            <h2>1. Hostel Inventory Summary</h2>

            <table border="1" cellpadding="10" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>Total Halls</th>
                    <th>Floors per Hall</th>
                    <th>Rooms per Floor</th>
                    <th>Beds per Room</th>
                </tr>

                <tr>
                    <td>${data.totalHalls}</td>
                    <td>${data.floorsPerHall}</td>
                    <td>${data.roomsPerFloor}</td>
                    <td>${data.bedsPerRoom}</td>
                </tr>
            </table>

            <br>

            <h2>2. Room and Bed Availability</h2>

            <table border="1" cellpadding="10" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>Total Rooms</th>
                    <th>Occupied Rooms</th>
                    <th>Available Rooms</th>
                </tr>

                <tr>
                    <td>${totalRooms}</td>
                    <td>${occupiedRooms}</td>
                    <td>${availableRooms}</td>
                </tr>

                <tr>
                    <th>Total Beds</th>
                    <th>Occupied Beds</th>
                    <th>Available Beds</th>
                </tr>

                <tr>
                    <td>${totalBeds}</td>
                    <td>${occupiedBeds}</td>
                    <td>${availableBeds}</td>
                </tr>
            </table>

            <h3>Bed Occupancy: ${occupancyPercentage}%</h3>

            <hr>

            <h2>3. Complaint Summary</h2>

            <table border="1" cellpadding="10" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>Total Complaints</th>
                    <th>Pending</th>
                    <th>In Progress</th>
                    <th>Resolved</th>
                    <th>Rejected</th>
                </tr>

                <tr>
                    <td>${complaints.length}</td>
                    <td>${pendingComplaints}</td>
                    <td>${inProgressComplaints}</td>
                    <td>${resolvedComplaints}</td>
                    <td>${rejectedComplaints}</td>
                </tr>
            </table>

            <hr>

            <h2>4. Room Change Request Summary</h2>

            <table border="1" cellpadding="10" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>Total Requests</th>
                    <th>Pending</th>
                    <th>Approved</th>
                    <th>Rejected</th>
                </tr>

                <tr>
                    <td>${requests.length}</td>
                    <td>${pendingRoomRequests}</td>
                    <td>${approvedRoomRequests}</td>
                    <td>${rejectedRoomRequests}</td>
                </tr>
            </table>

            <hr>

            <h2>5. Student Room Allocation Details</h2>

            <table border="1" cellpadding="8" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Batch</th>
                    <th>Hall</th>
                    <th>Floor</th>
                    <th>Room</th>
                    <th>Bed</th>
                </tr>

                ${allocationTable}
            </table>

            <hr>

            <h2>6. Complaint Details</h2>

            <table border="1" cellpadding="8" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Complaint</th>
                    <th>Status</th>
                    <th>Remarks</th>
                </tr>

                ${complaintTable}
            </table>

            <hr>

            <h2>7. Room Change Request Details</h2>

            <table border="1" cellpadding="8" cellspacing="0"
                   style="width:100%;border-collapse:collapse;text-align:center;">
                <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Current Hall/Room</th>
                    <th>Desired Hall/Room</th>
                    <th>Status</th>
                    <th>Remarks</th>
                </tr>

                ${roomRequestTable}
            </table>

            <hr>

            <h3 style="text-align:center;">
                End of Hostel Management Report
            </h3>

        </div>

        <div style="text-align:center;margin:20px;">
            <button onclick="printHostelReport()"
                    style="background:black;color:white;padding:10px;">
                Print / Save Report as PDF
            </button>
        </div>
    `;
}


// Print the generated report
function printHostelReport()
{
    var report = document.getElementById("hostelReport");

    if (report == null)
    {
        alert("Please generate the report first.");
        return;
    }

    var printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
        <head>
            <title>Hostel Management Report</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: black;
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: center;
                    word-break: break-word;
                }

                h1, h2, h3 {
                    text-align: center;
                }

                @media print {
                    body {
                        padding: 0;
                    }

                    table {
                        page-break-inside: auto;
                    }

                    tr {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>

        <body>
            ${report.innerHTML}
        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = function()
    {
        printWindow.print();
    };
}

function changeStudentPassword()
{
    var rollNo = localStorage.getItem("loggedInStudent");

    if (!rollNo)
    {
        alert("Please login first.");
        return;
    }

    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (!oldPassword || !newPassword || !confirmPassword)
    {
        alert("Please fill all password fields.");
        return;
    }

    if (newPassword.length < 6)
    {
        alert("New password must contain at least 6 characters.");
        return;
    }

    if (newPassword !== confirmPassword)
    {
        alert("New passwords do not match.");
        return;
    }

    var credentials = JSON.parse(
        localStorage.getItem("studentCredentials")
    ) || {};

    var student = credentials[rollNo.toLowerCase()];

    if (!student || student.password !== oldPassword)
    {
        alert("Old password is incorrect.");
        return;
    }

    student.password = newPassword;

    credentials[rollNo.toLowerCase()] = student;

    localStorage.setItem(
        "studentCredentials",
        JSON.stringify(credentials)
    );

    alert("Password changed successfully!");

    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}
// Open Change Password page
function openChangePassword()
{
    var rollNo = localStorage.getItem("loggedInStudent");

    if (rollNo == null)
    {
        alert("Please login first.");
        window.location.href = "Homepage.html";
        return;
    }

    window.location.href = "Change Password.html";
}
function roomDeallocationmt()
{
    window.location.href = "Room Deallocation.html";
}

function displayRoomDeallocation()
{
    var data = hostelGetData();

    var container = document.getElementById("deallocationContainer");

    container.innerHTML = "";

    if (data.allocations.length == 0)
    {
        container.innerHTML = `
            <tr>
                <td colspan="8">
                    No students are currently allocated to hostel rooms.
                </td>
            </tr>
        `;
        return;
    }

    for (var i = 0; i < data.allocations.length; i++)
    {
        var a = data.allocations[i];

        container.innerHTML += `
            <tr>
                <td>${escapeReportHTML(a.name)}</td>
                <td>${escapeReportHTML(a.rollNo)}</td>
                <td>${escapeReportHTML(a.batch)}</td>
                <td>${escapeReportHTML(a.hall)}</td>
                <td>${escapeReportHTML(a.floor || Math.ceil(a.room / 10))}</td>
                <td>${escapeReportHTML(a.room)}</td>
                <td>${escapeReportHTML(a.bed)}</td>

                <td>
                    <button
                        onclick="confirmRoomDeallocation(this)"
                        data-roll="${escapeReportHTML(a.rollNo)}"
                        style="background-color:red;color:white;padding:8px;">
                        Deallocate Room
                    </button>
                </td>
            </tr>
        `;
    }
}


function confirmRoomDeallocation(button)
{
    var rollNo = button.getAttribute("data-roll");

    var confirmation = confirm(
        "Are you sure you want to deallocate the room of student " +
        rollNo + "?\n\n" +
        "This will remove the room allocation and the student's login access."
    );

    if (confirmation == false)
    {
        return;
    }

    removeBedAllocation(rollNo);

    // Refresh the list after deallocation
    displayRoomDeallocation();
}
function profilemt() {
    window.location.href = "View Profile Management.html";
}

// Searches for a student using the roll number entered by management.
function searchManagementStudentProfile() {
    const rollNo = document.getElementById("searchRollNo").value.trim();

    const message = document.getElementById("profileMessage");
    const profile = document.getElementById("studentProfile");

    profile.style.display = "none";
    message.textContent = "";

    if (rollNo === "") {
        message.textContent = "Please enter a student roll number.";
        return;
    }

    const data = hostelGetData();

    // Finds the student's hostel allocation using their roll number.
    const student = data.allocations.find(
        allocation => String(allocation.rollNo).toLowerCase() === rollNo.toLowerCase()
    );

    if (!student) {
        message.textContent = "No student found with this roll number.";
        return;
    }

    // Counts all complaints and room-change requests submitted by this student.
    const complaintCount = (data.complaints || []).filter(
        complaint => String(complaint.rollNo).toLowerCase() === rollNo.toLowerCase()
    ).length;

    const roomChangeCount = (data.roomChangeRequests || []).filter(
        request => String(request.rollNo).toLowerCase() === rollNo.toLowerCase()
    ).length;

    const totalRequests = complaintCount + roomChangeCount;

    // Displays the student's profile information.
    document.getElementById("profileName").value = student.name;
    document.getElementById("profileRollNo").value = student.rollNo;
    document.getElementById("profileRoom").value = student.room;
    document.getElementById("profileBed").value = student.bed;
    document.getElementById("profileBatch").value = student.batch;
    document.getElementById("profileRequests").value = totalRequests;

    profile.style.display = "block";
}
