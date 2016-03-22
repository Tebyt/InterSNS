//
//  ViewController.swift
//  InterSNS
//
//  Created by Pan Chen on 4/1/15.
//  Copyright (c) 2015 Pan Chen. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    @IBOutlet var webView: UIWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        var url = NSURL(string:"http://xifanyrpy.jios.org:8000/")
        var req = NSURLRequest(URL:url!)
        self.webView!.loadRequest(req)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

