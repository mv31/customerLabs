import React, { useEffect, useState } from "react";
import { Button, Card, Form, I } from "react-bootstrap";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BASE_URL } from "../utills/constants";
const SaveSegment = ({ openSegment, handlePopup }) => {
  const initialData = [
    {
      label: "First Name",
      value: "first_name",
    },
    {
      label: "Last Name",
      value: "last_name",
    },
    {
      label: "Gender",
      value: "gender",
    },
    {
      label: "Age",
      value: "age",
    },
    {
      label: "Account Name",
      value: "account_name",
    },
    {
      label: "City",
      value: "city",
    },
    {
      label: "State",
      value: "state",
    },
  ];
  const [schemaList, setSchemaList] = useState(initialData);
  const [clonedSchemaList, setclonedSchemaList] = useState(initialData);
  const [selectedSchema, setSelectedSchema] = useState([]);
  const [formData, setFormData] = useState({});
  const [segmentName, setSegmentName] = useState({});
  const [response, setResponse] = useState(null);

  const handleschema = (e) => {
    const { value } = e?.target;
    let obj = JSON.parse(value);
    setFormData(obj);
  };

  const updateSchemaList = () => {
    const set = new Set(selectedSchema.map((item) => item?.value));
    const filteredArray = clonedSchemaList.filter(
      (item) => !set.has(item?.value)
    );
    setSchemaList(filteredArray);
  };

  const handleAddSchema = () => {
    if (Object.keys(formData).length !== 0) {
      let temp = [...selectedSchema];
      if (selectedSchema?.length === 0) {
        temp?.push({ ...formData, options: clonedSchemaList });
      } else {
        temp?.push({ ...formData, options: clonedSchemaList });
        for (let i = 0; i < temp?.length; i++) {
          const set = new Set(
            temp?.map((item, idex) => {
              return item?.value;
            })
          );
          const filteredArray = clonedSchemaList.filter((item, index) => {
            if (temp[i]?.value === item?.value) {
              return true;
            } else {
              return !set.has(item?.value);
            }
          });
          temp[i].options = filteredArray;
        }
      }
      setSelectedSchema(temp);
      setFormData({});
    }
  };
  const handleChange = (e, idx) => {
    const { value } = e?.target;
    let obj = JSON.parse(value);
    let temp = [...selectedSchema];
    temp[idx].label = obj?.label;
    temp[idx].value = obj?.value;

    for (let i = 0; i < temp?.length; i++) {
      const set = new Set(
        temp?.map((item, idex) => {
          return item?.value;
        })
      );
      const filteredArray = clonedSchemaList.filter((item, index) => {
        if (temp[i]?.value === item?.value) {
          return true;
        } else {
          return !set.has(item?.value);
        }
      });
      temp[i].options = filteredArray;
    }
    setSelectedSchema(temp);
  };

  const handleRemove = (e, idx) => {
    e?.preventDefault();
    let temp = [...selectedSchema];
    temp?.splice(idx, 1);
    for (let i = 0; i < temp?.length; i++) {
      const set = new Set(
        temp?.map((item, idex) => {
          return item?.value;
        })
      );
      const filteredArray = clonedSchemaList.filter((item, index) => {
        if (temp[i]?.value === item?.value) {
          return true;
        } else {
          return !set.has(item?.value);
        }
      });
      temp[i].options = filteredArray;
    }
    setSelectedSchema(temp);
  };

  const handleSaveSegment = async () => {
    const schemas = selectedSchema?.map((ele) => {
      let obj = {
        [ele?.value]: ele?.label,
      };
      return obj;
    });
    if (schemas?.length > 0 && segmentName?.segment_name) {
      setSegmentName((prev) => ({ ...prev, loading: true }));
      const postData = {
        segment_name: segmentName?.segment_name,
        schema: schemas,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };

      fetch(BASE_URL, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from WebHook:", data);
          alert("Response from webhook: Segment Saved Successfully..!");
        })
        .catch((error) => {
          console.error("Error sending POST request:", error);
        });
      setSegmentName((prev) => ({ ...prev, loading: false }));
    } else {
      alert("Please Fill all the Fields");
    }
  };

  useEffect(() => {
    updateSchemaList();
  }, [selectedSchema]);

  return (
    <div>
      <Form>
        <Form.Group controlId="formBasicInput">
          <Form.Label  className="text">
            Enter the Name of the Segment
          </Form.Label>
          <Form.Control
            className="segmentName"
            type="text"
            name="segment_name"
            placeholder="Name of the segment"
            value={segmentName?.segment_name}
            onChange={(e) => {
              setSegmentName((prev) => ({
                ...prev,
                [e?.target?.name]: e?.target?.value,
              }));
            }}
          />
        </Form.Group>
      </Form>

      <p className="text">
        To save your segment, you need to add the schemas to build the query
      </p>
      <div className="traits">
        <div className="user">
          <span className="green-dot"></span>
          <span>-User Traits</span>
        </div>
        <div className="group">
          <span className="red-dot"></span>
          <span> -Group Traits</span>
        </div>
      </div>
      {}
      <div>
        {selectedSchema?.length > 0 && (
          <Card className="card" >
            <Card.Body>
              {selectedSchema &&
                selectedSchema?.map((schema, idx) => {
                  return (
                    <div className="segments">
                      <span className="green-dot1"></span>
                      <Form.Group
                        className="Select-box"
                        controlId="formBasicSelect"
                      >
                        <Form.Control
                          as="select"
                          value={JSON.stringify({
                            label: schema?.label,
                            value: schema?.value,
                          })}
                          onChange={(e) => {
                            handleChange(e, idx);
                          }}
                          key={schema?.value}
                        >
                          {schema?.options &&
                            schema?.options?.map((ele) => {
                              return (
                                <option
                                  key={ele?.value}
                                  value={JSON.stringify({
                                    label: ele?.label,
                                    value: ele?.value,
                                  })}
                                >
                                  {ele?.label}
                                </option>
                              );
                            })}
                        </Form.Control>
                      </Form.Group>
                      <FontAwesomeIcon
                        icon={faMinus}
                        className="icon1"
                        onClick={(e) => {
                          handleRemove(e, idx);
                        }}
                      />
                    </div>
                  );
                })}
            </Card.Body>
          </Card>
        )}
      </div>
      <Form.Group style={{ margin: "15px" }} controlId="formBasicSelect">
        <Form.Control
          as="select"
          onChange={(e) => {
            handleschema(e);
          }}
          name="schema"
          value={JSON.stringify(formData)}
        >
          <option> Add Schema to Segment</option>
          {schemaList &&
            schemaList?.map((ele) => (
              <option
                key={ele?.value}
                value={JSON.stringify({ label: ele?.label, value: ele?.value })}
              >
                {ele?.label}
              </option>
            ))}
        </Form.Control>
      </Form.Group>
      <Button
        className="underline-button"
        variant="outlined"
        onClick={(e) => {
          e?.preventDefault();
          handleAddSchema();
        }}
      >
        <FontAwesomeIcon icon={faPlus} className="icon" />
        <span className="underline-text"> Add new Schema</span>
      </Button>
      <div>
        <div className="bottomButton">
          <Button
           className="saveBtn" 
            variant="primary"
            type="submit"
            onClick={(e) => {
              e?.preventDefault();
              handleSaveSegment();
            }}
            disabled={segmentName?.loading}
          >
            Save the Segment
          </Button>
          <Button variant="secondary" className="cancelBtn" onClick={handlePopup}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SaveSegment;
