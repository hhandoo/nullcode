import 'package:flutter/material.dart';
import 'interface/layout.dart';

void main() {
  runApp(const NullCodeApp());
}

class NullCodeApp extends StatelessWidget {
  const NullCodeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Null Code',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const AppLayout(),
    );
  }
}
