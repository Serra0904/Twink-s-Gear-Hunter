import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CurrentlyScanned() {
  useEffect(() => {
    setInterval(() => {
      try {
        axios
          .post("../api/scanner/get/lastServerScanned")
          .then(response => {
            this.setState({
              ...this.state,
              currentServers: response.data[0].servers
            });
            console.log(response.data[0].servers);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }, 7000);
  }, []);

  let serverCurrentlyScanned = this.state.currentServers.map(server => {
    return <span className="currentServer">{server.name}, </span>;
  });

  return { serverCurrentlyScanned };
}
