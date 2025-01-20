import "@testing-library/jest-dom";
import "jest-extended";
import { configure } from "@testing-library/react";

configure({ testIdAttribute: "data-testid" });
