// Get all complaints from browser storage
function getComplaints()
{
    return JSON.parse(localStorage.getItem("complaints")) || [];
}

// Save complaints to browser storage
function saveComplaints(complaints)
{
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

// Add a new complaint
function addComplaint(complaint)
{
    var complaints = getComplaints();

    complaints.push(complaint);

    saveComplaints(complaints);
}

// Update an existing complaint
function updateComplaint(id, status, remarks)
{
    var complaints = getComplaints();

    for (var i = 0; i < complaints.length; i++)
    {
        if (complaints[i].id == id)
        {
            complaints[i].status = status;
            complaints[i].remarks = remarks;
        }
    }

    saveComplaints(complaints);
}

// Delete a complaint
function deleteComplaint(id)
{
    var complaints = getComplaints();

    complaints = complaints.filter(function(c)
    {
        return c.id != id;
    });

    saveComplaints(complaints);
}
