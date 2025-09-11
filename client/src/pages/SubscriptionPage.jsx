import React, { useState } from "react";
import AllMembersPage from "./AllMembersPage"; 
import AddMember from "../components/AddMember"; 

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState("allMembers");

  return (
     <div style={{ border: "1px solid #ccc",
            borderRadius: "10px",
            width: "1350px",
            height: "100%",
            padding: "20px",
            position: "relative"
           }}>
      <h2>Subscriptions</h2>

      <nav>
       <button
          style={{ fontWeight: activeTab === "allMembers" ? "bold" : "normal" }}
          onClick={() => setActiveTab("allMembers")} >  All Members
        </button>{" "}

         <button
          style={{ fontWeight: activeTab === "addMember" ? "bold" : "normal" }}
          onClick={() => setActiveTab("addMember")} >  Add Members
        </button>

      </nav>
      <br />

      <div>
        {activeTab === "allMembers" && <AllMembersPage />}
        {activeTab === "addMember" && <AddMember />}
      </div>
    </div>
  );
}
