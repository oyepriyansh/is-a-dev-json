function toggleRecordInput(recordTypeInput) {
  var recordInput = recordTypeInput.nextElementSibling;
  var selectedOption = recordTypeInput.value;
  recordInput.style.display = selectedOption === "MX" || selectedOption === "A" ? "block" : "none";
}

function addRecord() {
  var recordContainer = document.getElementById("recordContainer");
  var hasCNAME = Array.from(document.getElementsByClassName("recordTypeInput")).some(function(element) {
    return element.value === "CNAME";
  });

  if (hasCNAME) {
    alert("You cannot add another record when CNAME is selected.");
    return;
  }

  var recordRow = document.createElement("div");
  recordRow.classList.add("recordRow");

  var recordTypeLabel = document.createElement("label");
  recordTypeLabel.innerHTML = "Record Type:";
  recordRow.appendChild(recordTypeLabel);

  var recordTypeInput = document.createElement("select");
  recordTypeInput.classList.add("recordTypeInput");
  var usedRecordTypes = Array.from(document.getElementsByClassName("recordTypeInput")).map(function(element) {
    return element.value;
  });
  var availableRecordTypes = ['CNAME', 'A', 'URL', 'MX', 'TXT'].filter(function(recordType) {
    if (usedRecordTypes.includes('URL') || usedRecordTypes.includes('CNAME') || usedRecordTypes.includes('A')) {
      return recordType !== 'URL' && recordType !== 'CNAME' && recordType !== 'A';
    }
    if (usedRecordTypes.includes('MX')) {
      return recordType !== 'MX';
    }
    if (usedRecordTypes.includes('TXT')) {
      return recordType !== 'TXT';
    }
    return true;
  });
  availableRecordTypes.forEach(function(recordType) {
    var option = document.createElement("option");
    option.value = recordType;
    option.text = recordType;
    recordTypeInput.appendChild(option);
  });
  recordRow.appendChild(recordTypeInput);

  var recordInputLabel = document.createElement("label");
  recordInputLabel.innerHTML = "Record:";
  recordRow.appendChild(recordInputLabel);

  var recordInput = document.createElement("textarea");
  recordInput.classList.add("recordInput");
  recordRow.appendChild(recordInput);

  recordContainer.appendChild(recordRow);
}

function toggleJSONBox() {
  var jsonBox = document.getElementById("jsonOutput");
  var copyButton = document.getElementById("copyButton");

  if (jsonBox.style.display === "none") {
    jsonBox.style.display = "block";
    copyButton.style.display = "block";
  } else {
    jsonBox.style.display = "none";
    copyButton.style.display = "none";
  }
}

function copyJSON() {
  var jsonBox = document.getElementById("jsonOutput");
  jsonBox.select();
  document.execCommand("copy");
  alert("JSON copied to clipboard!");
}

function generateJSON() {
  var username = document.getElementById("usernameInput").value.trim();
  var email = document.getElementById("emailInput").value.trim();
  var description = document.getElementById("descriptionInput").value.trim();

  if (!username) {
    alert("Username is a required field.");
    return;
  }

  var data = {
    "owner": {
      "username": username
    },
    "record": {}
  };

  if (email) {
    data.owner.email = email;
  } else {
    alert("Email is a required field.");
    return;
  }

  if (description) {
    data.description = description;
  }

  var recordRows = document.getElementsByClassName("recordRow");
  if (recordRows.length === 0) {
    alert("At least one record should be added.");
    return;
  }

  for (var i = 0; i < recordRows.length; i++) {
    var recordTypeInput = recordRows[i].getElementsByClassName("recordTypeInput")[0];
    var recordInput = recordRows[i].getElementsByClassName("recordInput")[0];

    var recordType = recordTypeInput.value;
    var recordValue = recordInput.value.trim();

    if (!recordType || !recordValue) {
      alert("Record type and record value are required for all records.");
      return;
    }

    if (recordType === "CNAME" || recordType === "URL" || recordType === "TXT") {
      var recordLines = recordValue.split("\n").map(function(line) {
        return line.trim();
      }).filter(function(line) {
        return line !== "";
      });

      if (recordLines.length > 1) {
        alert("Multiple CNAME, URL, and TXT records are not allowed.");
        return;
      }

      data.record[recordType] = recordLines[0];
    } else if (recordType === "MX" || recordType === "A") {
      var recordArray = recordValue.split("\n").map(function(item) {
        return item.trim();
      }).filter(function(item) {
        return item !== "";
      });

      data.record[recordType] = recordArray;
    } else {
      data.record[recordType] = recordValue;
    }
  }

  var jsonString = JSON.stringify(data, null, 4);
  var jsonBox = document.getElementById("jsonOutput");
  jsonBox.value = jsonString;

  var jsonBox = document.getElementById("jsonOutput");
  var copyButton = document.getElementById("copyButton");
  jsonBox.style.display = "block";
  copyButton.style.display = "block";
}
