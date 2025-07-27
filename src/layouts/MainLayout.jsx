import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const MainLayout = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Packages</Tab>
        <Tab>Tour Guides</Tab>
      </TabList>

      <TabPanel>
        <p>This is the Overview section.</p>
      </TabPanel>
      <TabPanel>
        <p>These are our travel packages.</p>
      </TabPanel>
      <TabPanel>
        <p>Meet our tour guides.</p>
      </TabPanel>
    </Tabs>
  );
};

export default MainLayout;
