import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CurrentlyScanned() {
  const [server, setServer] = useState([]);
  let serverCurrentlyScanned = [];

  useEffect(() => {
    setInterval(() => {
      try {
        axios
          .post("../api/scanner/get/lastServerScanned")
          .then(response => {
            setServer({
              currentServers: response.data[0].servers
            });
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }, 7000);
  }, []);

  serverCurrentlyScanned = server.currentServers
    ? server.currentServers.map((serv, index) => {
        return (
          <span className="currentServer" key={index}>
            {serv.name},{" "}
          </span>
        );
      })
    : "";

  console.log(server);

  return <div>{serverCurrentlyScanned}</div>;
}
