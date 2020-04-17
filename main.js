import m from "mithril";
import {Toaster, Button, Card, Col, Grid, Icon, Icons, MenuItem, PopoverMenu, Tooltip} from 'construct-ui';
import 'construct-ui/lib/index.css'

class Component {
    view() {
        return "Hullo";
    }
}

function make_theorem(html) {
    let html_src = html.innerHTML;
    // console.log(html_src);
    let content = m.trust(html_src);
    return {
      view: () => m(Card, {interactive: true, fluid: true}, content)
    }
}

function manage_footnotes() {
    let refs = document.getElementsByClassName("footnote-ref");
    console.log(refs);
    let refList = [];
    for (let ref_ of refs) {
        refList.push(ref_);
    }
    for (let ref of refList) {
        let trigger = m.trust(ref.outerHTML);
        let id = ref.href.split("#")[1];
        let footnote = document.getElementById(id);
        let content = m.trust(footnote.innerHTML);

        console.log("ref id", id);

      	let span = document.createElement("span"); 
        ref.parentNode.replaceChild(span, ref);
         
        // Doesn't work ?
        m.mount(span, {
            view: () => m(Tooltip, {trigger: m("span", trigger), content: content})
        });
    }
}

function manage_code() {
    const AppToaster = new Toaster();

    let codes = document.getElementsByTagName("pre")
    // TODO: assert only <code> in it.
    console.log(refs);
    let codes_ = [];
    for (let ref_ of codes) {
        codes_.push(ref_);
    }
    for (let codeElt of codes) {
        //console.log(codeElt.children[0]);
        codeElt.style["padding"] = "0";
        codeElt.style["background"] = "";
        codeElt.style["border"] = "initial";
        codeElt.children[0].style["white-space"] = "pre";
        codeElt.children[0].style["padding"] = "0";

        let content = m.trust(codeElt.outerHTML);
        //let content = m.trust("<pre style='padding:1em;'><code style='white-space:pre;'>if True:\n    return False;\nok?</code></pre>")

        let source = codeElt.children[0].innerText;
        console.log("*");
        console.log(codeElt.outerHTML);

        let div = document.createElement("div"); 
        let parent = codeElt.parentElement;
        parent.replaceChild(div, codeElt);

        // TODO: implement prompt escaping.

        m.mount(div, {view: () => 
            m("div", {style:{padding: "0 1em 1em 1em", background: "white"}},
                m(Grid, 
                    m(Col, {span:1, offset:11}, 
                        m(Tooltip,
                            {
                                trigger: m(Button, {
                                    iconLeft: Icons.COPY, 
                                    basic: true, 
                                    style: {float: "right"},
                                    onclick: () => {
                                            AppToaster.show({
                                                message: "Copied to clipboard",
                                                icon: Icons.INFO,
                                                timeout: 3000,
                                            });
                                            console.log("kkk");
                                            return navigator.clipboard.writeText(source);
                                    },
                                }),
                                content: "Copy"
                            }
                        )
                    )
                ),
                content,
                m(AppToaster, {
                    clearOnEscapeKey: true,
                    inline: false,
                    position: "top"
                  })
            )
        });

    }
}

function manage_previews() {
    let links = document.getElementsByTagName("a")
    let links_ = [];
    for (let link of links) {
        console.log("***", link.href);
        links_.push(link);
    }
    for (let link_ of links_) {
        let targetID = link_.href.split("#")[1];
        let target = document.getElementById(targetID);
        if (target) {
            let text = target.outerHTML;

            let link_wrap = m.trust(link_.outerHTML);

            let span = document.createElement("span"); 
            let parent = link_.parentElement;
            parent.replaceChild(span, link_);

            m.mount(span, {view: () => 
                m(Tooltip, {
                    content: m.trust(text),
                    trigger: m("span", link_wrap)
                })
            });
        }

    }
}

function main() {
    let root = document.getElementById("TOC");
    //console.log(root);
    m.mount(root, Component);

    let theorems = document.getElementsByClassName("theorem cdis-section");
    for (let theorem of theorems) {
        m.mount(theorem, make_theorem(theorem)); 
    }

    manage_footnotes();
    manage_code();
    manage_previews();
}

document.addEventListener("DOMContentLoaded", main);