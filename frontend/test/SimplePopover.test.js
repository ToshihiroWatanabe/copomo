import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SimplePopover from "../src/components/SimplePopover";

describe("SimplePopoverコンポーネント", () => {
  it("描画されること", () => {
    const wrapper = render(<SimplePopover />);
    expect(wrapper).toMatchSnapshot();
  });
  it("メッセージが描画されること", () => {
    const wrapper = render(<SimplePopover message="メッセージ" />);
    expect(wrapper).toMatchSnapshot();

    screen.debug();

    // fireEvent.click(
  });
});
