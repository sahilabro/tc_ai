import { BarTreeView } from "./bar-tree";
import { Timeline, TimelineDataEntry , stubData as TimelineStubbedData} from "./timeline";
import React, { useState, useEffect } from "react";
import LinearBuffer from "./spinner";
import { stubData as BarStubbedData, BarTreeViewDataEntry } from "./bar-tree";


export const Evaluation = () => {
  const [propertyData, setPropertyData] = useState<BarTreeViewDataEntry[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineDataEntry[]>([]);
//   const [attempts, setAttempts] = useState(0);

    // console.log(attempts)
    useEffect(() => {
        let attempts = 0;
    const fetchData = async () => {
      try {
        console.log("getting data from eval...");
        const response = await fetch("http://127.0.0.1:8000/property/");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data && data["results_json"] !== "undefined" && data["extracted_dates"] !== undefined) {
          console.log("got some data", data);
          setPropertyData(data["results_json"]);
          setTimelineData(data["extracted_dates"]);
          
        } else if (attempts === -1) {
            setPropertyData(BarStubbedData);
            setTimelineData(TimelineStubbedData);
          return;
        } else {
            // If enough no datas (results_json, extracted not there, do render stubb)
            console.error("no data");
            console.log(attempts)
          if (attempts > 2) {
              attempts = -1;
              return;
          }
            //   setAttempts(attempts => attempts + 1);
            attempts += 1;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch initial data
    fetchData();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchData, 3_000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const waitingForData =
    !propertyData ||
    !timelineData ||
    propertyData.length === 0 ||
    timelineData.length === 0;

  console.log(waitingForData);
  console.log(propertyData);
  console.log(timelineData);

  if (waitingForData) {
    return (
      <div style={{ width: "80vw", marginTop: "32px" }}>
        <LinearBuffer />
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        width: "80vw",
        marginBlockStart: "",
        justifyContent: "center",
      }}
    >
      <BarTreeView bartreeData={propertyData} />
      <Timeline timelineData={timelineData} />
    </div>
  );
};
