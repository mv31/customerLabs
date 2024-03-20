import React, { useEffect, useState } from "react";

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
  const [segmentName, setSegmentName] = useState();
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
          console.log(filteredArray, "FILTERED");
          temp[i].options = filteredArray;
        }
      }
      setSelectedSchema(temp);
      setFormData({});
    }
  };
  const handleChange = (e, idx) => {
    const { name, value } = e?.target;
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
      console.log(filteredArray, "FILTERED");
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
    try {
      const url = "https://cors-anywhere.herokuapp.com/https://webhook.site/7ff7d42b-98a3-45b7-a398-aa08eb9ac77a";
      const data = { ...segmentName, schema: schemas };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key":""
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData) {
        console.log(responseData,'RES');
        setResponse(responseData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    console.log({ ...segmentName, schema: schemas });
  };
  useEffect(() => {
    console.log(formData, selectedSchema, schemaList, "form");
  }, [formData, selectedSchema, schemaList]);
  useEffect(() => {
    updateSchemaList();
  }, [selectedSchema]);
  return (
    <div>
      <h1>Saving Segment</h1>
      <p>Enter the Name of the Segment</p>
      <input
        name="segment_name"
        value={segmentName?.segment_name}
        onChange={(e) => {
          setSegmentName((prev) => ({
            ...prev,
            [e?.target?.name]: e?.target?.value,
          }));
        }}
      />
      <p>
        To save your segment, you need to add the schemas to build the query
      </p>
      <div>
        <span>-User Traits</span>
        <span> -Group Traits</span>
      </div>
      {}
      <div>
        {selectedSchema &&
          selectedSchema?.map((schema, idx) => {
            return (
              <select
                key={schema?.value}
                value={JSON.stringify({
                  label: schema?.label,
                  value: schema?.value,
                })}
                onChange={(e) => {
                  handleChange(e, idx);
                }}
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
              </select>
            );
          })}
      </div>
      <select
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
      </select>
      <button
        onClick={(e) => {
          e?.preventDefault();
          handleAddSchema();
        }}
      >
        Add new Schema
      </button>
      <div>
        <button
          onClick={(e) => {
            e?.preventDefault();
            handleSaveSegment();
          }}
        >
          save Segment
        </button>
        <button onClick={(e) => handlePopup(e, "close")}>cancel</button>
      </div>
    </div>
  );
};

export default SaveSegment;
